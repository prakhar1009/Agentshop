import { FastifyInstance } from 'fastify';
import prisma from '../config/database';
import chainService from '../services/chainService';
import { createOrderSchema, deliverOrderSchema, purchaseOrderSchema } from '../utils/validation';
import { encrypt, hashData, keccak256Hash } from '../utils/crypto';
import logger from '../config/logger';

export default async function orderRoutes(fastify: FastifyInstance) {
  // Simple purchase endpoint - creates order and returns payment requirements
  fastify.post('/api/orders/purchase', async (request, reply) => {
    try {
      const data = purchaseOrderSchema.parse(request.body);

      if (!data.buyerAddress) {
        return reply.code(400).send({ error: 'Buyer address is required' });
      }

      const product = await prisma.product.findUnique({
        where: { id: data.productId },
        include: { merchant: true },
      });

      if (!product || !product.active) {
        return reply.code(404).send({ error: 'Product not found or inactive' });
      }

      let buyer = await prisma.user.findUnique({
        where: { walletAddress: data.buyerAddress },
      });

      if (!buyer) {
        buyer = await prisma.user.create({
          data: {
            walletAddress: data.buyerAddress,
            role: 'BUYER',
          },
        });
      }

      // Create order in PENDING state
      const order = await prisma.order.create({
        data: {
          productId: data.productId,
          buyerId: buyer.id,
          status: 'PENDING_PAYMENT',
          amountUSDC: product.priceUSDC,
          timeoutAt: new Date(Date.now() + product.deliveryTimeoutSec * 1000),
        },
      });

      logger.info(`Purchase order created: ${order.id} for ${data.buyerAddress}`);

      return reply.code(201).send({
        orderId: order.id,
        productName: product.name,
        merchantAddress: product.merchant.walletAddress,
        amount: product.priceUSDC,
        status: 'pending_payment',
        message: 'Order created. Please complete payment with MetaMask.',
      });
    } catch (error) {
      logger.error({ err: error }, 'Error creating purchase order');
      return reply.code(500).send({ error: 'Failed to create purchase order' });
    }
  });

  // Confirm payment after MetaMask transaction
  fastify.post('/api/orders/:id/confirm', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { txHash } = request.body as { txHash: string };

      const order = await prisma.order.findUnique({
        where: { id },
        include: { 
          product: { 
            include: { merchant: true } 
          }, 
          buyer: true 
        },
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      // Generate cryptographic receipt
      const receiptData = {
        orderId: id,
        txHash: txHash,
        amountUSDC: order.amountUSDC,
        buyerAddress: order.buyer.walletAddress,
        merchantAddress: order.product.merchant.walletAddress,
        productId: order.productId,
        productName: order.product.name,
        timestamp: Date.now(),
      };
      const receiptHash = keccak256Hash(JSON.stringify(receiptData));

      // Update order status to PAID with receipt
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: 'PAID',
          paymentProofHash: txHash,
          receiptHash: receiptHash,
        },
        include: {
          product: true,
          buyer: true,
        },
      });

      // Create transaction feed entry
      await prisma.transactionFeed.create({
        data: {
          type: 'PRODUCT_PURCHASE',
          description: `Order ${id} paid - ${updatedOrder.product.name}`,
          fromAddress: updatedOrder.buyer.walletAddress,
          toAddress: updatedOrder.product.merchant.walletAddress,
          amountUSDC: updatedOrder.amountUSDC,
          txHash,
          metadata: JSON.stringify({ 
            orderId: id,
            productId: updatedOrder.productId,
            productName: updatedOrder.product.name,
            receiptHash: receiptHash,
            receiptData: receiptData,
          }),
        },
      });

      logger.info(`Order ${id} confirmed with txHash: ${txHash}`);

      return reply.send({
        success: true,
        orderId: id,
        status: 'paid',
        txHash,
        receiptHash: receiptHash,
        receiptData: receiptData,
        message: 'Payment confirmed successfully!',
      });
    } catch (error) {
      logger.error({ err: error }, 'Error confirming order payment');
      return reply.code(500).send({ error: 'Failed to confirm payment' });
    }
  });

  fastify.post('/api/orders', async (request, reply) => {
    try {
      const data = createOrderSchema.parse(request.body);

      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product || !product.active) {
        return reply.code(404).send({ error: 'Product not found or inactive' });
      }

      if (!data.buyerAddress) {
        return reply.code(400).send({ error: 'Buyer address is required' });
      }

      let buyer = await prisma.user.findUnique({
        where: { walletAddress: data.buyerAddress },
      });

      if (!buyer) {
        buyer = await prisma.user.create({
          data: {
            walletAddress: data.buyerAddress,
            role: 'BUYER',
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          productId: data.productId,
          buyerId: buyer.id,
          status: 'PAID',
          amountUSDC: product.priceUSDC,
          paymentProofHash: data.paymentProofHash,
          timeoutAt: new Date(Date.now() + product.deliveryTimeoutSec * 1000),
        },
      });

      logger.info(`Order created: ${order.id}`);

      return reply.code(201).send({
        orderId: order.id,
        status: order.status,
        nextStep: 'create_escrow',
      });
    } catch (error) {
      logger.error({ err: error }, 'Error creating order');
      return reply.code(500).send({ error: 'Failed to create order' });
    }
  });

  fastify.post('/api/orders/:id/create-escrow', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          product: true,
          buyer: true,
        },
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      if (order.status !== 'PAID') {
        return reply.code(400).send({ error: 'Order not in PAID status' });
      }

      const { txHash } = await chainService.createEscrowOrder({
        orderId: id,
        productId: order.productId,
        buyer: order.buyer.walletAddress,
        amount: order.amountUSDC,
        paymentProofHash: order.paymentProofHash || '0x0',
        requiresVerification: order.product.requiresVerification,
      });

      await prisma.order.update({
        where: { id },
        data: {
          status: 'ESCROW_CREATED',
          escrowTxHash: txHash,
          escrowOrderIdOnchain: id,
        },
      });

      await prisma.transactionFeed.create({
        data: {
          type: 'PURCHASE',
          description: `Escrow created for ${order.product.name}`,
          amountUSDC: order.amountUSDC,
          fromAddress: order.buyer.walletAddress,
          txHash,
        },
      });

      logger.info(`Escrow created for order: ${id} | Tx: ${txHash}`);

      return reply.send({
        orderId: id,
        status: 'ESCROW_CREATED',
        txHash,
        nextStep: 'delivery',
      });
    } catch (error) {
      logger.error({ err: error }, 'Error creating escrow');
      return reply.code(500).send({ error: 'Failed to create escrow' });
    }
  });

  fastify.post('/api/orders/:id/deliver', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = deliverOrderSchema.parse(request.body);

      const order = await prisma.order.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      if (order.status !== 'ESCROW_CREATED') {
        return reply.code(400).send({ error: 'Order not ready for delivery' });
      }

      const encryptedSecret = encrypt(data.secret);
      const deliverProofHash = keccak256Hash(hashData(data.secret));

      const delivery = await prisma.delivery.create({
        data: {
          orderId: id,
          merchantId: order.product.merchantId,
          deliveredSecretEncrypted: encryptedSecret,
          deliverProofHash,
        },
      });

      if (order.escrowOrderIdOnchain) {
        const txHash = await chainService.markDelivered(
          order.escrowOrderIdOnchain,
          deliverProofHash
        );

        await prisma.delivery.update({
          where: { id: delivery.id },
          data: { releaseTxHash: txHash },
        });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'DELIVERED' },
      });

      logger.info(`Order delivered: ${id}`);

      return reply.send({
        orderId: id,
        status: 'DELIVERED',
        requiresVerification: order.product.requiresVerification,
        nextStep: order.product.requiresVerification ? 'verification' : 'release',
      });
    } catch (error) {
      logger.error({ err: error }, 'Error delivering order');
      return reply.code(500).send({ error: 'Failed to deliver order' });
    }
  });

  fastify.get('/api/orders/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          product: {
            include: {
              merchant: { select: { walletAddress: true } },
            },
          },
          buyer: { select: { walletAddress: true } },
          delivery: true,
          verificationJob: true,
        },
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      return reply.send({
        orderId: order.id,
        status: order.status,
        product: {
          name: order.product.name,
          priceUSDC: order.product.priceUSDC,
          requiresVerification: order.product.requiresVerification,
        },
        buyer: order.buyer.walletAddress,
        merchant: order.product.merchant.walletAddress,
        amountUSDC: order.amountUSDC,
        paymentProofHash: order.paymentProofHash,
        escrowTxHash: order.escrowTxHash,
        delivered: !!order.delivery,
        verified: order.verificationJob?.passed,
        createdAt: order.createdAt,
        timeoutAt: order.timeoutAt,
      });
    } catch (error) {
      logger.error({ err: error }, 'Error fetching order');
      return reply.code(500).send({ error: 'Failed to fetch order' });
    }
  });

  fastify.get('/api/orders', async (request, reply) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          product: { select: { name: true } },
          buyer: { select: { walletAddress: true } },
        },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({
        orders: orders.map(o => ({
          id: o.id,
          productId: o.productId,
          status: o.status,
          productName: o.product.name,
          buyerAddress: o.buyer.walletAddress,
          priceUSDC: o.amountUSDC,
          txHash: o.paymentProofHash,
          receiptHash: o.receiptHash,
          createdAt: o.createdAt,
        })),
      });
    } catch (error) {
      logger.error({ err: error }, 'Error fetching orders');
      return reply.code(500).send({ error: 'Failed to fetch orders' });
    }
  });
}
