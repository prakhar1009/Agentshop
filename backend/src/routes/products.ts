import { FastifyInstance } from 'fastify';
import prisma from '../config/database';
import chainService from '../services/chainService';
import { createProductSchema } from '../utils/validation';
import { parseUSDC, keccak256Hash } from '../utils/crypto';
import logger from '../config/logger';

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.post('/api/products', async (request, reply) => {
    try {
      const data = createProductSchema.parse(request.body);
      const merchantAddress = (request.body as any).merchantAddress;

      if (!merchantAddress) {
        return reply.code(400).send({ error: 'Merchant address required' });
      }

      let merchant = await prisma.user.findUnique({
        where: { walletAddress: merchantAddress },
      });

      if (!merchant) {
        merchant = await prisma.user.create({
          data: {
            walletAddress: merchantAddress,
            role: 'MERCHANT',
          },
        });
      }

      const metadataHash = data.metadataJson 
        ? keccak256Hash(data.metadataJson) 
        : keccak256Hash(JSON.stringify({ name: data.name }));

      const priceInSmallestUnit = parseUSDC(data.priceUSDC);

      // Try to create on-chain, but don't fail if it doesn't work
      let txHash: string | undefined;
      try {
        const result = await chainService.createProduct(
          priceInSmallestUnit,
          data.platformFeeBps || 500,
          data.deliveryTimeoutSec || 3600,
          data.requiresVerification,
          metadataHash
        );
        txHash = result.txHash;
      } catch (chainError) {
        logger.warn({ err: chainError }, 'On-chain product creation failed (continuing anyway)');
        // Continue without on-chain tx for demo purposes
      }

      const product = await prisma.product.create({
        data: {
          merchantId: merchant.id,
          name: data.name,
          description: data.description,
          priceUSDC: data.priceUSDC,
          deliveryType: data.deliveryType,
          requiresVerification: data.requiresVerification,
          deliveryTimeoutSec: data.deliveryTimeoutSec || 3600,
          platformFeeBps: data.platformFeeBps || 500,
          metadataJson: data.metadataJson,
          onchainProductId: txHash ? '1' : undefined, // Mock for now
        },
      });

      logger.info(`Product created: ${product.id}${txHash ? ` | Tx: ${txHash}` : ' (off-chain only)'}`);

      return reply.code(201).send({
        productId: product.id,
        txHash,
        checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product.id}`,
      });
    } catch (error) {
      logger.error({ err: error }, 'Error creating product');
      return reply.code(500).send({ error: 'Failed to create product' });
    }
  });

  fastify.get('/api/products/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          merchant: {
            select: {
              walletAddress: true,
            },
          },
        },
      });

      if (!product) {
        return reply.code(404).send({ error: 'Product not found' });
      }

      return reply.send({
        id: product.id,
        name: product.name,
        description: product.description,
        priceUSDC: product.priceUSDC,
        deliveryType: product.deliveryType,
        requiresVerification: product.requiresVerification,
        deliveryTimeoutSec: product.deliveryTimeoutSec,
        merchant: product.merchant.walletAddress,
        active: product.active,
      });
    } catch (error) {
      logger.error({ err: error }, 'Error fetching product');
      return reply.code(500).send({ error: 'Failed to fetch product' });
    }
  });

  fastify.get('/api/products', async (request, reply) => {
    try {
      const products = await prisma.product.findMany({
        where: { active: true },
        include: {
          merchant: {
            select: {
              walletAddress: true,
            },
          },
        },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          priceUSDC: p.priceUSDC,
          deliveryType: p.deliveryType,
          requiresVerification: p.requiresVerification,
          merchantAddress: p.merchant.walletAddress,
          active: p.active,
        })),
      });
    } catch (error) {
      logger.error({ err: error }, 'Error fetching products');
      return reply.code(500).send({ error: 'Failed to fetch products' });
    }
  });
}
