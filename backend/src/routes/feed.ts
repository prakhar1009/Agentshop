import { FastifyInstance } from 'fastify';
import prisma from '../config/database';
import logger from '../config/logger';

export default async function feedRoutes(fastify: FastifyInstance) {
  fastify.get('/api/feed', async (request, reply) => {
    try {
      const { limit = 50 } = request.query as { limit?: number };

      const feed = await prisma.transactionFeed.findMany({
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({
        feed: feed.map(item => ({
          id: item.id,
          type: item.type,
          description: item.description,
          amountUSDC: item.amountUSDC,
          fromAddress: item.fromAddress,
          toAddress: item.toAddress,
          txHash: item.txHash,
          createdAt: item.createdAt,
          metadata: item.metadata ? JSON.parse(item.metadata) : null,
        })),
      });
    } catch (error) {
      logger.error('Error fetching feed:', error);
      return reply.code(500).send({ error: 'Failed to fetch transaction feed' });
    }
  });
}
