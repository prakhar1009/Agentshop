export interface X402PaymentIntent {
  paymentId: string;
  recipient: string;
  amount: string;
  currency: string;
  expiresAt: number;
  paymentRequirements?: any;
  metadata?: Record<string, any>;
}

export interface X402PaymentProof {
  paymentId: string;
  txHash?: string;
  signature: string;
  timestamp: number;
  amount: string;
  from: string;
  to: string;
  metadata?: Record<string, any>;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: any;
  execute: (params: any) => Promise<any>;
}

export interface AgentReasoningStep {
  step: number;
  type: 'thinking' | 'tool_call' | 'decision' | 'error';
  description: string;
  toolName?: string;
  toolParams?: any;
  result?: any;
  timestamp: number;
}

export interface VerificationResult {
  passed: boolean;
  evidenceHash: string;
  details: string;
  timestamp: number;
}

export interface EscrowOrder {
  orderId: string;
  productId: string;
  buyer: string;
  amount: string;
  paymentProofHash: string;
  requiresVerification: boolean;
}

export interface DeliveryProof {
  orderId: string;
  secretHash: string;
  deliveredAt: number;
}

export interface VerificationSubmission {
  orderId: string;
  verifierAddress: string;
  passed: boolean;
  evidenceHash: string;
}

export interface BudgetCheck {
  allowed: boolean;
  dailyLimit: string;
  spentToday: string;
  remaining: string;
  requestedAmount: string;
  reason?: string;
}

export interface TransactionFeedItem {
  type: 'PURCHASE' | 'VERIFICATION' | 'RELEASE' | 'REFUND';
  description: string;
  amountUSDC?: string;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  metadata?: Record<string, any>;
}
