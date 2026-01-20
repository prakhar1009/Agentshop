import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  
  DATABASE_URL: z.string(),
  
  CRONOS_RPC_URL: z.string().url(),
  CRONOS_CHAIN_ID: z.string().transform(Number),
  BACKEND_PRIVATE_KEY: z.string().startsWith('0x'),
  
  PRODUCT_REGISTRY_ADDRESS: z.string().startsWith('0x').optional(),
  ESCROW_VAULT_ADDRESS: z.string().startsWith('0x').optional(),
  RECEIPT_REGISTRY_ADDRESS: z.string().startsWith('0x').optional(),
  USDC_TOKEN_ADDRESS: z.string().startsWith('0x'),
  
  X402_FACILITATOR_URL: z.string().url(),
  X402_API_KEY: z.string().optional(),
  
  VERIFIER_WALLET_ADDRESS: z.string().startsWith('0x').optional(),
  VERIFIER_PRIVATE_KEY: z.string().startsWith('0x').optional(),
  VERIFIER_FEE_USDC: z.string().default('0.02'),
  
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string().default('gpt-4-turbo-preview'),
  
  CRYPTO_COM_API_KEY: z.string().optional(),
  CRYPTO_COM_MCP_URL: z.string().url().optional(),
  
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  
  DELIVERY_TIMEOUT_SECONDS: z.string().transform(Number).default('3600'),
  ESCROW_TIMEOUT_SECONDS: z.string().transform(Number).default('7200'),
  
  PLATFORM_FEE_BPS: z.string().transform(Number).default('500'),
});

export type Config = z.infer<typeof configSchema>;

let config: Config;

try {
  config = configSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DATABASE_URL: process.env.DATABASE_URL,
    CRONOS_RPC_URL: process.env.CRONOS_RPC_URL,
    CRONOS_CHAIN_ID: process.env.CRONOS_CHAIN_ID,
    BACKEND_PRIVATE_KEY: process.env.BACKEND_PRIVATE_KEY,
    PRODUCT_REGISTRY_ADDRESS: process.env.PRODUCT_REGISTRY_ADDRESS,
    ESCROW_VAULT_ADDRESS: process.env.ESCROW_VAULT_ADDRESS,
    RECEIPT_REGISTRY_ADDRESS: process.env.RECEIPT_REGISTRY_ADDRESS,
    USDC_TOKEN_ADDRESS: process.env.USDC_TOKEN_ADDRESS,
    X402_FACILITATOR_URL: process.env.X402_FACILITATOR_URL,
    X402_API_KEY: process.env.X402_API_KEY,
    VERIFIER_WALLET_ADDRESS: process.env.VERIFIER_WALLET_ADDRESS,
    VERIFIER_PRIVATE_KEY: process.env.VERIFIER_PRIVATE_KEY,
    VERIFIER_FEE_USDC: process.env.VERIFIER_FEE_USDC,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    CRYPTO_COM_API_KEY: process.env.CRYPTO_COM_API_KEY,
    CRYPTO_COM_MCP_URL: process.env.CRYPTO_COM_MCP_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    DELIVERY_TIMEOUT_SECONDS: process.env.DELIVERY_TIMEOUT_SECONDS,
    ESCROW_TIMEOUT_SECONDS: process.env.ESCROW_TIMEOUT_SECONDS,
    PLATFORM_FEE_BPS: process.env.PLATFORM_FEE_BPS,
  });
} catch (error) {
  console.error('❌ Invalid configuration:', error);
  process.exit(1);
}

export default config;
