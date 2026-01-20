import { FastifyInstance } from 'fastify';
import x402Service from '../services/x402Service';
import prisma from '../config/database';
import { x402PaymentIntentSchema, x402ConfirmSchema } from '../utils/validation';
import logger from '../config/logger';

export default async function x402Routes(fastify: FastifyInstance) {
  fastify.post('/api/x402/payment-intent', async (request, reply) => {
    try {
      const data = x402PaymentIntentSchema.parse(request.body);

      const paymentIntent = await x402Service.createPaymentIntent(
        data.recipient,
        data.amount,
        data.currency,
        data.metadata
      );

      return reply.send(paymentIntent);
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      return reply.code(500).send({ error: 'Failed to create payment intent' });
    }
  });

  fastify.post('/api/x402/confirm', async (request, reply) => {
    try {
      const data = x402ConfirmSchema.parse(request.body);

      const { verified, proofHash } = await x402Service.verifyPaymentProof(
        data.paymentId,
        data.proof
      );

      if (!verified) {
        return reply.code(400).send({ error: 'Payment verification failed', verified: false });
      }

      await prisma.transactionFeed.create({
        data: {
          type: 'PURCHASE',
          description: `Payment confirmed via x402`,
          amountUSDC: data.proof.amount,
          fromAddress: data.proof.from,
          toAddress: data.proof.to,
          txHash: data.proof.txHash,
          metadata: JSON.stringify({ paymentId: data.paymentId }),
        },
      });

      logger.info(`Payment confirmed: ${data.paymentId} | Hash: ${proofHash}`);

      return reply.send({
        verified: true,
        proofHash,
        paymentId: data.paymentId,
      });
    } catch (error) {
      logger.error('Error confirming payment:', error);
      return reply.code(500).send({ error: 'Failed to confirm payment' });
    }
  });

  fastify.get('/api/x402/payment/:paymentId/status', async (request, reply) => {
    try {
      const { paymentId } = request.params as { paymentId: string };

      const status = await x402Service.getPaymentStatus(paymentId);

      return reply.send(status);
    } catch (error) {
      logger.error('Error fetching payment status:', error);
      return reply.code(500).send({ error: 'Failed to fetch payment status' });
    }
  });
}
