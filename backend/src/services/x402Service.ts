import axios from 'axios';
import config from '../config';
import logger from '../config/logger';
import { generateProofHash } from '../utils/crypto';
import type { X402PaymentIntent, X402PaymentProof } from '../types';

class X402Service {
  private readonly facilitatorUrl: string;
  private readonly usdcAsset: string;
  private readonly network: string;

  constructor() {
    this.facilitatorUrl = config.X402_FACILITATOR_URL;
    this.usdcAsset = config.USDC_TOKEN_ADDRESS;
    this.network = config.NODE_ENV === 'production' ? 'cronos-mainnet' : 'cronos-testnet';
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.facilitatorUrl.replace('/v2/x402', '')}/healthcheck`);
      return response.data.status === 'success';
    } catch (error) {
      logger.error('x402 facilitator health check failed:', error);
      return false;
    }
  }

  async getSupportedNetworks(): Promise<any> {
    try {
      const response = await axios.get(`${this.facilitatorUrl}/supported`);
      return response.data.kinds;
    } catch (error) {
      logger.error('Error fetching supported networks:', error);
      return [];
    }
  }

  createPaymentRequirements(
    recipient: string,
    amountUSDC: string,
    description: string = 'AgentShop Payment',
    timeoutSeconds: number = 300
  ): any {
    const amountInSmallestUnit = (parseFloat(amountUSDC) * 1_000_000).toString();

    return {
      scheme: 'exact',
      network: this.network,
      payTo: recipient,
      asset: this.usdcAsset,
      maxAmountRequired: amountInSmallestUnit,
      maxTimeoutSeconds: timeoutSeconds,
      description,
      mimeType: 'application/json',
    };
  }

  async createPaymentIntent(
    recipient: string,
    amountUSDC: string,
    description: string = 'AgentShop Payment',
    metadata?: Record<string, any>
  ): Promise<X402PaymentIntent> {
    try {
      const paymentRequirements = this.createPaymentRequirements(recipient, amountUSDC, description);
      const paymentId = `agentshop_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const paymentIntent: X402PaymentIntent = {
        paymentId,
        recipient,
        amount: amountUSDC,
        currency: 'USDC',
        expiresAt: Date.now() + (paymentRequirements.maxTimeoutSeconds * 1000),
        paymentRequirements,
        metadata,
      };

      logger.info(`x402 payment requirements created for: ${recipient} | Amount: ${amountUSDC} USDC`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating x402 payment intent:', error);
      throw new Error('Failed to create x402 payment intent');
    }
  }

  async verifyPaymentProof(
    paymentHeader: string,
    paymentRequirements: any
  ): Promise<{ isValid: boolean; invalidReason: string | null; proofHash: string }> {
    try {
      const response = await axios.post(
        `${this.facilitatorUrl}/verify`,
        {
          x402Version: 1,
          paymentHeader,
          paymentRequirements,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X402-Version': '1',
          },
        }
      );

      const isValid = response.data.isValid === true;
      const invalidReason = response.data.invalidReason || null;
      const proofHash = generateProofHash({ paymentHeader, paymentRequirements });

      if (isValid) {
        logger.info(`x402 payment verified | Hash: ${proofHash}`);
      } else {
        logger.warn(`x402 payment verification failed: ${invalidReason}`);
      }

      return { isValid, invalidReason, proofHash };
    } catch (error: any) {
      logger.error('Error verifying x402 payment:', error.response?.data || error.message);
      return {
        isValid: false,
        invalidReason: error.response?.data?.error || 'Verification failed',
        proofHash: generateProofHash({ paymentHeader, paymentRequirements }),
      };
    }
  }

  async settlePayment(
    paymentHeader: string,
    paymentRequirements: any
  ): Promise<{ success: boolean; txHash?: string; blockNumber?: number; error?: string }> {
    try {
      const response = await axios.post(
        `${this.facilitatorUrl}/settle`,
        {
          x402Version: 1,
          paymentHeader,
          paymentRequirements,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X402-Version': '1',
          },
          timeout: 60000,
        }
      );

      if (response.data.txHash) {
        logger.info(`x402 payment settled | TX: ${response.data.txHash}`);
        return {
          success: true,
          txHash: response.data.txHash,
          blockNumber: response.data.blockNumber,
        };
      }

      return { success: false, error: 'No transaction hash returned' };
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message;
      logger.error('Error settling x402 payment:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  async verifyAndSettle(
    paymentHeader: string,
    paymentRequirements: any
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    const verification = await this.verifyPaymentProof(paymentHeader, paymentRequirements);
    
    if (!verification.isValid) {
      return {
        success: false,
        error: `Payment verification failed: ${verification.invalidReason}`,
      };
    }

    return await this.settlePayment(paymentHeader, paymentRequirements);
  }

  generateMockProof(from: string, to: string, amount: string): X402PaymentProof {
    return {
      paymentId: `mock_${Date.now()}`,
      signature: `0x${'a'.repeat(130)}`,
      timestamp: Date.now(),
      amount,
      from,
      to,
      metadata: { mock: true },
    };
  }
}

export default new X402Service();
