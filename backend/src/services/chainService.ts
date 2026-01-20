import { createWalletClient, createPublicClient, http, parseAbi, Hash, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { cronosTestnet } from 'viem/chains';
import config from '../config';
import logger from '../config/logger';
import type { EscrowOrder, DeliveryProof, VerificationSubmission } from '../types';

const cronosChain = {
  ...cronosTestnet,
  id: config.CRONOS_CHAIN_ID,
  rpcUrls: {
    default: { http: [config.CRONOS_RPC_URL] },
    public: { http: [config.CRONOS_RPC_URL] },
  },
};

const account = privateKeyToAccount(config.BACKEND_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: cronosChain,
  transport: http(config.CRONOS_RPC_URL),
});

const publicClient = createPublicClient({
  chain: cronosChain,
  transport: http(config.CRONOS_RPC_URL),
});

const PRODUCT_REGISTRY_ABI = parseAbi([
  'function createProduct(uint256 price, uint16 platformFeeBps, uint32 deliveryTimeout, bool requiresVerification, bytes32 metadataHash) external returns (uint256)',
  'function getProduct(uint256 productId) external view returns (address merchant, uint256 price, uint16 platformFeeBps, uint32 deliveryTimeout, bool requiresVerification, bytes32 metadataHash)',
  'function setActive(uint256 productId, bool active) external',
]);

const ESCROW_VAULT_ABI = parseAbi([
  'function createOrder(uint256 productId, address buyer, uint256 amount, bytes32 paymentProofHash) external returns (uint256)',
  'function markDelivered(uint256 orderId, bytes32 deliverProofHash) external',
  'function submitVerification(uint256 orderId, bytes32 resultHash, bool passed) external',
  'function release(uint256 orderId) external returns (bool)',
  'function refund(uint256 orderId) external returns (bool)',
  'function getOrder(uint256 orderId) external view returns (uint256 productId, address buyer, uint256 amount, uint256 createdAt, bool delivered, bool verified, bool refunded, bytes32 paymentProofHash, bytes32 deliverProofHash)',
]);

const RECEIPT_REGISTRY_ABI = parseAbi([
  'event Receipt(uint256 indexed orderId, address indexed buyer, address indexed merchant, uint256 amount, uint256 timestamp)',
  'function recordReceipt(uint256 orderId, address buyer, address merchant, uint256 amount) external',
]);

class ChainService {
  async createProduct(
    price: bigint,
    platformFeeBps: number,
    deliveryTimeout: number,
    requiresVerification: boolean,
    metadataHash: string
  ): Promise<{ txHash: Hash; productId?: bigint }> {
    try {
      if (!config.PRODUCT_REGISTRY_ADDRESS) {
        throw new Error('PRODUCT_REGISTRY_ADDRESS not configured');
      }

      const hash = await walletClient.writeContract({
        address: config.PRODUCT_REGISTRY_ADDRESS as Address,
        abi: PRODUCT_REGISTRY_ABI,
        functionName: 'createProduct',
        args: [price, platformFeeBps, deliveryTimeout, requiresVerification, metadataHash as `0x${string}`],
      });

      logger.info(`Product creation tx sent: ${hash}`);
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Product created successfully: ${hash}`);

      return { txHash: hash };
    } catch (error) {
      logger.error('Error creating product on-chain:', error);
      throw error;
    }
  }

  async createEscrowOrder(order: EscrowOrder): Promise<{ txHash: Hash; onchainOrderId?: string }> {
    try {
      if (!config.ESCROW_VAULT_ADDRESS) {
        throw new Error('ESCROW_VAULT_ADDRESS not configured');
      }

      const productId = BigInt(order.productId);
      const amount = BigInt(order.amount);

      const hash = await walletClient.writeContract({
        address: config.ESCROW_VAULT_ADDRESS as Address,
        abi: ESCROW_VAULT_ABI,
        functionName: 'createOrder',
        args: [productId, order.buyer as Address, amount, order.paymentProofHash as `0x${string}`],
      });

      logger.info(`Escrow order creation tx sent: ${hash}`);
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Escrow order created successfully: ${hash}`);

      return { txHash: hash };
    } catch (error) {
      logger.error('Error creating escrow order:', error);
      throw error;
    }
  }

  async markDelivered(onchainOrderId: string, deliverProofHash: string): Promise<Hash> {
    try {
      if (!config.ESCROW_VAULT_ADDRESS) {
        throw new Error('ESCROW_VAULT_ADDRESS not configured');
      }

      const orderId = BigInt(onchainOrderId);

      const hash = await walletClient.writeContract({
        address: config.ESCROW_VAULT_ADDRESS as Address,
        abi: ESCROW_VAULT_ABI,
        functionName: 'markDelivered',
        args: [orderId, deliverProofHash as `0x${string}`],
      });

      logger.info(`Mark delivered tx sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Delivery marked successfully: ${hash}`);

      return hash;
    } catch (error) {
      logger.error('Error marking delivery:', error);
      throw error;
    }
  }

  async submitVerification(submission: VerificationSubmission): Promise<Hash> {
    try {
      if (!config.ESCROW_VAULT_ADDRESS) {
        throw new Error('ESCROW_VAULT_ADDRESS not configured');
      }

      const orderId = BigInt(submission.orderId);

      const hash = await walletClient.writeContract({
        address: config.ESCROW_VAULT_ADDRESS as Address,
        abi: ESCROW_VAULT_ABI,
        functionName: 'submitVerification',
        args: [orderId, submission.evidenceHash as `0x${string}`, submission.passed],
      });

      logger.info(`Verification submission tx sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Verification submitted successfully: ${hash}`);

      return hash;
    } catch (error) {
      logger.error('Error submitting verification:', error);
      throw error;
    }
  }

  async releaseEscrow(onchainOrderId: string): Promise<Hash> {
    try {
      if (!config.ESCROW_VAULT_ADDRESS) {
        throw new Error('ESCROW_VAULT_ADDRESS not configured');
      }

      const orderId = BigInt(onchainOrderId);

      const hash = await walletClient.writeContract({
        address: config.ESCROW_VAULT_ADDRESS as Address,
        abi: ESCROW_VAULT_ABI,
        functionName: 'release',
        args: [orderId],
      });

      logger.info(`Release escrow tx sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Escrow released successfully: ${hash}`);

      return hash;
    } catch (error) {
      logger.error('Error releasing escrow:', error);
      throw error;
    }
  }

  async refundEscrow(onchainOrderId: string): Promise<Hash> {
    try {
      if (!config.ESCROW_VAULT_ADDRESS) {
        throw new Error('ESCROW_VAULT_ADDRESS not configured');
      }

      const orderId = BigInt(onchainOrderId);

      const hash = await walletClient.writeContract({
        address: config.ESCROW_VAULT_ADDRESS as Address,
        abi: ESCROW_VAULT_ABI,
        functionName: 'refund',
        args: [orderId],
      });

      logger.info(`Refund tx sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Refund processed successfully: ${hash}`);

      return hash;
    } catch (error) {
      logger.error('Error processing refund:', error);
      throw error;
    }
  }

  async recordReceipt(
    onchainOrderId: string,
    buyer: string,
    merchant: string,
    amount: bigint
  ): Promise<Hash> {
    try {
      if (!config.RECEIPT_REGISTRY_ADDRESS) {
        throw new Error('RECEIPT_REGISTRY_ADDRESS not configured');
      }

      const orderId = BigInt(onchainOrderId);

      const hash = await walletClient.writeContract({
        address: config.RECEIPT_REGISTRY_ADDRESS as Address,
        abi: RECEIPT_REGISTRY_ABI,
        functionName: 'recordReceipt',
        args: [orderId, buyer as Address, merchant as Address, amount],
      });

      logger.info(`Receipt recording tx sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      logger.info(`Receipt recorded successfully: ${hash}`);

      return hash;
    } catch (error) {
      logger.error('Error recording receipt:', error);
      throw error;
    }
  }

  getPublicClient() {
    return publicClient;
  }

  getWalletClient() {
    return walletClient;
  }
}

export default new ChainService();
