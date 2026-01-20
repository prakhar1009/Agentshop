import { z } from 'zod';

export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  priceUSDC: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid USDC amount'),
  deliveryType: z.enum(['INSTANT', 'ESCROW', 'VERIFICATION_REQUIRED']),
  requiresVerification: z.boolean().default(false),
  deliveryTimeoutSec: z.number().min(300).max(86400).default(3600),
  platformFeeBps: z.number().min(0).max(1000).default(500),
  metadataJson: z.string().optional(),
});

export const createOrderSchema = z.object({
  productId: z.string(),
  paymentProofHash: z.string(),
  buyerAddress: addressSchema,
});

export const deliverOrderSchema = z.object({
  orderId: z.string(),
  secret: z.string().min(1),
});

export const x402PaymentIntentSchema = z.object({
  recipient: addressSchema,
  amount: z.string(),
  currency: z.string().default('USDC'),
  metadata: z.record(z.any()).optional(),
});

export const x402ConfirmSchema = z.object({
  paymentId: z.string(),
  proof: z.object({
    txHash: z.string().optional(),
    signature: z.string(),
    timestamp: z.number(),
    amount: z.string(),
    from: addressSchema,
    to: addressSchema,
  }),
});

export const agentExecuteSchema = z.object({
  prompt: z.string().min(1).max(500),
  userId: z.string(),
  budget: z.object({
    dailyLimit: z.string(),
    perTxLimit: z.string(),
  }).optional(),
});

export const setBudgetSchema = z.object({
  userId: z.string(),
  dailyLimitUSDC: z.string(),
  perTxLimitUSDC: z.string(),
  categoriesJson: z.string().optional(),
});
