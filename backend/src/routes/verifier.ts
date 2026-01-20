import { FastifyInstance } from 'fastify';
import verifierService from '../services/verifierService';
import logger from '../config/logger';

export default async function verifierRoutes(fastify: FastifyInstance) {
  fastify.post('/api/orders/:orderId/hire-verifier', async (request, reply) => {
    try {
      const { orderId } = request.params as { orderId: string };

      const jobId = await verifierService.createVerificationJob(orderId);

      return reply.send({
        jobId,
        verifierFee: process.env.VERIFIER_FEE_USDC || '0.02',
        status: 'verification_job_created',
        message: 'Verifier agent hired successfully',
      });
    } catch (error) {
      logger.error('Error hiring verifier:', error);
      return reply.code(500).send({ error: 'Failed to hire verifier' });
    }
  });

  fastify.post('/api/verify/:jobId/run', async (request, reply) => {
    try {
      const { jobId } = request.params as { jobId: string };

      await verifierService.processVerificationJob(jobId);

      return reply.send({
        jobId,
        status: 'verification_completed',
        message: 'Verification completed successfully',
      });
    } catch (error) {
      logger.error('Error running verification:', error);
      return reply.code(500).send({ error: 'Failed to run verification' });
    }
  });

  fastify.get('/api/verifier/stats', async (request, reply) => {
    try {
      const stats = await verifierService.getVerifierStats();

      return reply.send({
        verifierWallet: process.env.VERIFIER_WALLET_ADDRESS,
        totalJobsCompleted: stats.totalJobsCompleted,
        totalJobsPassed: stats.totalJobsPassed,
        totalJobsFailed: stats.totalJobsFailed,
        totalEarnedUSDC: stats.totalEarnedUSDC,
        avgResponseTimeMs: stats.avgResponseTimeMs,
        successRate: stats.successRate.toFixed(1) + '%',
      });
    } catch (error) {
      logger.error('Error fetching verifier stats:', error);
      return reply.code(500).send({ error: 'Failed to fetch verifier stats' });
    }
  });
}
