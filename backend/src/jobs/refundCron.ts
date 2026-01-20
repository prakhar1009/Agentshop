import cron from 'node-cron';
import prisma from '../config/database';
import chainService from '../services/chainService';
import logger from '../config/logger';

export function startRefundCron() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      logger.info('Running refund cron job...');

      const now = new Date();
      const expiredOrders = await prisma.order.findMany({
        where: {
          status: {
            in: ['ESCROW_CREATED', 'DELIVERED'],
          },
          timeoutAt: {
            lte: now,
          },
        },
        include: {
          product: true,
          buyer: true,
          delivery: true,
          verificationJob: true,
        },
      });

      logger.info(`Found ${expiredOrders.length} expired orders to process`);

      for (const order of expiredOrders) {
        try {
          const shouldRefund = 
            !order.delivery || 
            (order.product.requiresVerification && !order.verificationJob?.passed);

          if (shouldRefund && order.escrowOrderIdOnchain) {
            logger.info(`Processing refund for order: ${order.id}`);

            const txHash = await chainService.refundEscrow(order.escrowOrderIdOnchain);

            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'REFUNDED' },
            });

            await prisma.transactionFeed.create({
              data: {
                type: 'REFUND',
                description: `Auto-refund for order timeout`,
                amountUSDC: order.amountUSDC,
                toAddress: order.buyer.walletAddress,
                txHash,
              },
            });

            logger.info(`Refund processed for order: ${order.id} | Tx: ${txHash}`);
          }
        } catch (error) {
          logger.error(`Failed to process refund for order ${order.id}:`, error);
        }
      }

      logger.info('Refund cron job completed');
    } catch (error) {
      logger.error('Refund cron job error:', error);
    }
  });

  logger.info('✅ Refund cron job started (runs every 5 minutes)');
}
