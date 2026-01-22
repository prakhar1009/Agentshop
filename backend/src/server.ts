import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import config from './config';
import logger from './config/logger';
import { connectDatabase } from './config/database';
import { startRefundCron } from './jobs/refundCron';

import productRoutes from './routes/products';
import x402Routes from './routes/x402';
import orderRoutes from './routes/orders';
import verifierRoutes from './routes/verifier';
import agentRoutes from './routes/agent';
import feedRoutes from './routes/feed';
import exportRoutes from './routes/export';
import langGraphAgentRoutes from './routes/langGraphAgent';

const fastify = Fastify({
  logger: logger as any,
});

async function start() {
  try {
    await fastify.register(helmet, {
      contentSecurityPolicy: false,
    });

    await fastify.register(cors, {
      origin: config.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : true,
      credentials: true,
    });

    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });

    await connectDatabase();

    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
      };
    });

    fastify.get('/', async (request, reply) => {
      return {
        name: 'AgentShop Backend API',
        version: '1.0.0',
        description: 'AI Agent Commerce with x402 & Escrow',
        endpoints: {
          health: '/health',
          products: '/api/products',
          orders: '/api/orders',
          x402: '/api/x402',
          verifier: '/api/verifier',
          agent: '/api/agent',
          feed: '/api/feed',
        },
      };
    });

    await fastify.register(productRoutes);
    await fastify.register(x402Routes);
    await fastify.register(orderRoutes);
    await fastify.register(verifierRoutes);
    await fastify.register(agentRoutes);
    await fastify.register(feedRoutes);
    await fastify.register(exportRoutes);
    await fastify.register(langGraphAgentRoutes);

    startRefundCron();

    await fastify.listen({
      port: config.PORT,
      host: config.HOST,
    });

    logger.info(`
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║       🚀 AgentShop Backend Started 🚀         ║
    ║                                               ║
    ║   Environment: ${config.NODE_ENV.padEnd(32)}║
    ║   Port:        ${config.PORT.toString().padEnd(32)}║
    ║   Host:        ${config.HOST.padEnd(32)}║
    ║                                               ║
    ║   📡 Cronos RPC:   ${config.CRONOS_RPC_URL.substring(0, 28)}...║
    ║   ⛓️  Chain ID:     ${config.CRONOS_CHAIN_ID.toString().padEnd(32)}║
    ║                                               ║
    ║   ✅ Database:     Connected                  ║
    ║   ✅ Cron Jobs:    Running                    ║
    ║   ✅ x402:         Configured                 ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
    `);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

start();
