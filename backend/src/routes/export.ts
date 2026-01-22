import { FastifyInstance } from 'fastify';
import prisma from '../config/database';
import logger from '../config/logger';

export default async function exportRoutes(fastify: FastifyInstance) {
  // Export order with full proof chain
  fastify.get('/api/orders/:id/export', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          product: {
            include: { merchant: true }
          },
          buyer: true,
        },
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      // Get transaction feed entry
      const txFeed = await prisma.transactionFeed.findFirst({
        where: {
          txHash: order.paymentProofHash,
        },
      });

      // Build complete proof certificate
      const certificate = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        order: {
          id: order.id,
          status: order.status,
          amountUSDC: order.amountUSDC,
          createdAt: order.createdAt.toISOString(),
          paidAt: order.updatedAt.toISOString(),
        },
        product: {
          id: order.product.id,
          name: order.product.name,
          description: order.product.description,
          priceUSDC: order.product.priceUSDC,
        },
        buyer: {
          walletAddress: order.buyer.walletAddress,
        },
        merchant: {
          walletAddress: order.product.merchant.walletAddress,
        },
        blockchain: {
          network: 'Cronos Testnet',
          chainId: 338,
          txHash: order.paymentProofHash,
          explorerUrl: order.paymentProofHash 
            ? `https://explorer.cronos.org/testnet/tx/${order.paymentProofHash}`
            : null,
        },
        cryptographicProof: {
          receiptHash: order.receiptHash,
          algorithm: 'keccak256',
          receiptData: txFeed?.metadata ? JSON.parse(txFeed.metadata).receiptData : null,
        },
        verification: {
          status: order.receiptHash ? 'VERIFIED' : 'UNVERIFIED',
          method: 'Cryptographic Receipt Hash',
          timestamp: order.updatedAt.toISOString(),
        },
      };

      logger.info(`Order ${id} exported by ${order.buyer.walletAddress}`);

      return reply
        .header('Content-Type', 'application/json')
        .header('Content-Disposition', `attachment; filename="order-${id}-proof.json"`)
        .send(certificate);
    } catch (error) {
      logger.error({ err: error }, 'Error exporting order');
      return reply.code(500).send({ error: 'Failed to export order' });
    }
  });
}
