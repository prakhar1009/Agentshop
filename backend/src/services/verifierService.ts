import axios from 'axios';
import config from '../config';
import logger from '../config/logger';
import prisma from '../config/database';
import chainService from './chainService';
import x402Service from './x402Service';
import { hashData, keccak256Hash } from '../utils/crypto';
import type { VerificationResult } from '../types';

class VerifierService {
  private readonly verifierWallet: string;

  constructor() {
    this.verifierWallet = config.VERIFIER_WALLET_ADDRESS || '';
  }

  async runVerification(orderId: string, secret: string): Promise<VerificationResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Starting verification for order: ${orderId}`);

      const passed = await this.testAPIKey(secret);
      
      const evidenceData = {
        orderId,
        secret: hashData(secret),
        timestamp: Date.now(),
        passed,
        testEndpoint: '/api/test',
      };

      const evidenceHash = keccak256Hash(JSON.stringify(evidenceData));
      const responseTime = Date.now() - startTime;

      logger.info(`Verification completed: ${orderId} | Passed: ${passed} | Time: ${responseTime}ms`);

      return {
        passed,
        evidenceHash,
        details: passed ? 'API key validated successfully' : 'API key validation failed',
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('Verification error:', error);
      
      const evidenceHash = keccak256Hash(JSON.stringify({
        orderId,
        error: 'Verification failed',
        timestamp: Date.now(),
      }));

      return {
        passed: false,
        evidenceHash,
        details: 'Verification encountered an error',
        timestamp: Date.now(),
      };
    }
  }

  private async testAPIKey(apiKey: string): Promise<boolean> {
    try {
      const testUrl = `${config.X402_FACILITATOR_URL.replace('/cronos-x402-facilitator-api', '')}/api/test?key=${apiKey}`;
      
      const response = await axios.get(testUrl, {
        timeout: 5000,
        validateStatus: (status) => status < 500,
      });

      return response.status === 200 && response.data?.valid === true;
    } catch (error) {
      logger.warn('API key test failed:', error);
      return false;
    }
  }

  async processVerificationJob(jobId: string): Promise<void> {
    try {
      const job = await prisma.verificationJob.findUnique({
        where: { id: jobId },
        include: {
          order: {
            include: {
              delivery: true,
              product: true,
            },
          },
        },
      });

      if (!job || !job.order.delivery) {
        throw new Error('Verification job or delivery not found');
      }

      const order = job.order;
      const delivery = order.delivery;

      const result = await this.runVerification(order.id, delivery.deliveredSecretEncrypted);

      await prisma.verificationJob.update({
        where: { id: jobId },
        data: {
          passed: result.passed,
          evidenceHash: result.evidenceHash,
          completedAt: new Date(),
        },
      });

      if (order.escrowOrderIdOnchain) {
        const txHash = await chainService.submitVerification({
          orderId: order.escrowOrderIdOnchain,
          verifierAddress: this.verifierWallet,
          passed: result.passed,
          evidenceHash: result.evidenceHash,
        });

        await prisma.verificationJob.update({
          where: { id: jobId },
          data: { verificationTxHash: txHash },
        });

        if (result.passed) {
          const releaseTxHash = await chainService.releaseEscrow(order.escrowOrderIdOnchain);
          
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'RELEASED' },
          });

          await prisma.delivery.update({
            where: { orderId: order.id },
            data: { releaseTxHash },
          });

          logger.info(`Escrow released for order: ${order.id} | Tx: ${releaseTxHash}`);
        }
      }

      await this.updateVerifierStats(result.passed);

      logger.info(`Verification job completed: ${jobId} | Passed: ${result.passed}`);
    } catch (error) {
      logger.error('Error processing verification job:', error);
      throw error;
    }
  }

  async createVerificationJob(orderId: string): Promise<string> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { product: true },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const paymentIntent = await x402Service.createPaymentIntent(
        this.verifierWallet,
        config.VERIFIER_FEE_USDC,
        'USDC',
        { orderId, type: 'verifier_fee' }
      );

      const job = await prisma.verificationJob.create({
        data: {
          orderId,
          verifierWallet: this.verifierWallet,
          verifierPaymentProofHash: null,
        },
      });

      logger.info(`Verification job created: ${job.id} | Payment: ${paymentIntent.paymentId}`);

      return job.id;
    } catch (error) {
      logger.error('Error creating verification job:', error);
      throw error;
    }
  }

  private async updateVerifierStats(passed: boolean): Promise<void> {
    try {
      const stats = await prisma.verifierStats.findUnique({
        where: { verifierWallet: this.verifierWallet },
      });

      if (!stats) {
        await prisma.verifierStats.create({
          data: {
            verifierWallet: this.verifierWallet,
            totalJobsCompleted: 1,
            totalJobsPassed: passed ? 1 : 0,
            totalJobsFailed: passed ? 0 : 1,
            totalEarnedUSDC: config.VERIFIER_FEE_USDC,
            avgResponseTimeMs: 2000,
            successRate: passed ? 100 : 0,
            lastJobAt: new Date(),
          },
        });
      } else {
        const totalJobs = stats.totalJobsCompleted + 1;
        const totalPassed = stats.totalJobsPassed + (passed ? 1 : 0);
        const totalFailed = stats.totalJobsFailed + (passed ? 0 : 1);
        const successRate = (totalPassed / totalJobs) * 100;
        const totalEarned = parseFloat(stats.totalEarnedUSDC) + parseFloat(config.VERIFIER_FEE_USDC);

        await prisma.verifierStats.update({
          where: { verifierWallet: this.verifierWallet },
          data: {
            totalJobsCompleted: totalJobs,
            totalJobsPassed: totalPassed,
            totalJobsFailed: totalFailed,
            totalEarnedUSDC: totalEarned.toFixed(2),
            successRate,
            lastJobAt: new Date(),
          },
        });
      }
    } catch (error) {
      logger.error('Error updating verifier stats:', error);
    }
  }

  async getVerifierStats() {
    try {
      const stats = await prisma.verifierStats.findUnique({
        where: { verifierWallet: this.verifierWallet },
      });

      return stats || {
        totalJobsCompleted: 0,
        totalJobsPassed: 0,
        totalJobsFailed: 0,
        totalEarnedUSDC: '0.00',
        avgResponseTimeMs: 0,
        successRate: 0,
      };
    } catch (error) {
      logger.error('Error fetching verifier stats:', error);
      throw error;
    }
  }
}

export default new VerifierService();
