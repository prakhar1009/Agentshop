import OpenAI from 'openai';
import config from '../config';
import logger from '../config/logger';
import prisma from '../config/database';
import x402Service from './x402Service';
import verifierService from './verifierService';
import { parseUSDC, formatUSDC } from '../utils/crypto';
import type { AgentReasoningStep, BudgetCheck, AgentTool } from '../types';

class AgentService {
  private openai: OpenAI;
  private tools: AgentTool[];

  constructor() {
    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    this.tools = this.initializeTools();
  }

  private initializeTools(): AgentTool[] {
    return [
      {
        name: 'searchProduct',
        description: 'Search for products by name or description',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
        execute: async (params) => this.searchProduct(params.query),
      },
      {
        name: 'checkBudget',
        description: 'Check if purchase is within budget limits',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            amount: { type: 'string', description: 'Amount in USDC' },
          },
          required: ['userId', 'amount'],
        },
        execute: async (params) => this.checkBudget(params.userId, params.amount),
      },
      {
        name: 'createPurchase',
        description: 'Create purchase order with x402 payment',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            userId: { type: 'string' },
            buyerAddress: { type: 'string' },
          },
          required: ['productId', 'userId', 'buyerAddress'],
        },
        execute: async (params) => this.createPurchase(params.productId, params.userId, params.buyerAddress),
      },
      {
        name: 'hireVerifier',
        description: 'Hire verifier agent to test product',
        parameters: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
          },
          required: ['orderId'],
        },
        execute: async (params) => this.hireVerifier(params.orderId),
      },
    ];
  }

  async executeAgentTask(userId: string, prompt: string): Promise<{
    success: boolean;
    reasoningSteps: AgentReasoningStep[];
    result?: any;
    error?: string;
  }> {
    const reasoningSteps: AgentReasoningStep[] = [];
    const startTime = Date.now();

    try {
      reasoningSteps.push({
        step: 1,
        type: 'thinking',
        description: `Analyzing request: "${prompt}"`,
        timestamp: Date.now(),
      });

      const completion = await this.openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an AI agent that can autonomously purchase and verify digital products using x402 gasless payments on Cronos blockchain.
            
Available tools:
- searchProduct: Find products by name
- checkBudget: Verify budget allows purchase
- createPurchase: Buy product with x402 payment
- hireVerifier: Pay verifier agent to test product

Always follow this flow:
1. Search for the product
2. Check budget (include verifier fee if verification needed)
3. Create purchase with x402
4. If product requires verification, hire verifier agent

Be concise and only use tools when necessary.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        tools: this.tools.map(tool => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
        tool_choice: 'auto',
      });

      const message = completion.choices[0].message;
      let finalResult: any = null;

      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          const tool = this.tools.find(t => t.name === toolCall.function.name);
          if (!tool) continue;

          const params = JSON.parse(toolCall.function.arguments);
          
          reasoningSteps.push({
            step: reasoningSteps.length + 1,
            type: 'tool_call',
            description: `Calling ${tool.name}`,
            toolName: tool.name,
            toolParams: params,
            timestamp: Date.now(),
          });

          const result = await tool.execute({ ...params, userId });
          finalResult = result;

          reasoningSteps.push({
            step: reasoningSteps.length + 1,
            type: 'decision',
            description: `${tool.name} completed`,
            result,
            timestamp: Date.now(),
          });
        }
      }

      const executionTime = Date.now() - startTime;

      reasoningSteps.push({
        step: reasoningSteps.length + 1,
        type: 'decision',
        description: `Task completed in ${executionTime}ms`,
        timestamp: Date.now(),
      });

      return {
        success: true,
        reasoningSteps,
        result: finalResult,
      };
    } catch (error) {
      logger.error({ err: error }, 'Agent execution error');
      
      reasoningSteps.push({
        step: reasoningSteps.length + 1,
        type: 'error',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      });

      return {
        success: false,
        reasoningSteps,
        error: error instanceof Error ? error.message : 'Agent execution failed',
      };
    }
  }

  private async searchProduct(query: string) {
    // Parse price filters from query (e.g., "under $1", "less than $2", "below 5 USDC")
    const priceMatch = query.match(/(?:under|less than|below|cheaper than)\s*\$?(\d+\.?\d*)/i);
    let maxPrice: number | undefined;
    
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
      // Remove price filter from query for text search
      query = query.replace(priceMatch[0], '').trim();
    }

    // Build search terms - split query and make flexible
    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    
    const products = await prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        merchant: true,
      },
    });

    // Filter products by text match and price
    const filtered = products.filter(p => {
      // Check price filter
      if (maxPrice !== undefined) {
        const price = parseFloat(p.priceUSDC);
        if (price >= maxPrice) return false;
      }

      // If no text query, return all (for "show me all" queries)
      if (searchTerms.length === 0) return true;

      // Check if product matches any search term
      const productText = `${p.name} ${p.description}`.toLowerCase();
      return searchTerms.some(term => productText.includes(term));
    });

    return {
      products: filtered.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        priceUSDC: p.priceUSDC,
        deliveryType: p.deliveryType,
        requiresVerification: p.requiresVerification,
        merchantAddress: p.merchant.walletAddress,
      })),
    };
  }

  private async checkBudget(userId: string, amount: string): Promise<BudgetCheck> {
    try {
      const budget = await prisma.agentBudget.findUnique({
        where: { userId },
      });

      if (!budget) {
        return {
          allowed: false,
          dailyLimit: '0',
          spentToday: '0',
          remaining: '0',
          requestedAmount: amount,
          reason: 'No budget configured',
        };
      }

      const dailyLimit = parseUSDC(budget.dailyLimitUSDC);
      const spentToday = parseUSDC(budget.spentTodayUSDC);
      const requestedAmount = parseUSDC(amount);
      const remaining = dailyLimit - spentToday;

      const allowed = requestedAmount <= remaining;

      return {
        allowed,
        dailyLimit: formatUSDC(dailyLimit),
        spentToday: formatUSDC(spentToday),
        remaining: formatUSDC(remaining),
        requestedAmount: amount,
        reason: allowed ? 'Budget approved' : 'Insufficient budget',
      };
    } catch (error) {
      logger.error({ err: error }, 'Budget check error');
      throw error;
    }
  }

  private async createPurchase(productId: string, userId: string, buyerAddress: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { merchant: true },
      });

      if (!product || !product.active) {
        throw new Error('Product not found or inactive');
      }

      // Find user by wallet address to get user.id
      const user = await prisma.user.findUnique({
        where: { walletAddress: buyerAddress },
      });

      if (!user) {
        throw new Error('User not found. Please set budget first.');
      }

      const totalAmount = parseFloat(product.priceUSDC) + 
        (product.requiresVerification ? parseFloat(config.VERIFIER_FEE_USDC) : 0);

      const budgetCheck = await this.checkBudget(user.id, totalAmount.toFixed(2));
      if (!budgetCheck.allowed) {
        throw new Error('Purchase exceeds budget');
      }

      // Create order with PAID status (agent purchase is automatic)
      const txHash = `agent_tx_${Date.now()}`;
      const order = await prisma.order.create({
        data: {
          productId,
          buyerId: user.id,
          status: 'PAID',
          amountUSDC: product.priceUSDC,
          paymentProofHash: `agent_purchase_${Date.now()}`,
          timeoutAt: new Date(Date.now() + product.deliveryTimeoutSec * 1000),
        },
      });

      // Update budget
      await prisma.agentBudget.update({
        where: { userId: user.id },
        data: {
          spentTodayUSDC: (parseFloat(budgetCheck.spentToday) + totalAmount).toFixed(2),
        },
      });

      // Log transaction
      await prisma.transactionFeed.create({
        data: {
          type: 'PRODUCT_PURCHASE',
          description: `Agent purchased ${product.name}`,
          fromAddress: buyerAddress,
          toAddress: product.merchant.walletAddress,
          amountUSDC: product.priceUSDC,
          txHash: txHash,
          metadata: JSON.stringify({
            orderId: order.id,
            productId,
            agentPurchase: true,
          }),
        },
      });

      return {
        orderId: order.id,
        amount: product.priceUSDC,
        status: 'paid',
        message: `Successfully purchased ${product.name}`,
        requiresVerification: product.requiresVerification,
      };
    } catch (error) {
      logger.error({ err: error }, 'Create purchase error');
      throw error;
    }
  }

  private async hireVerifier(orderId: string) {
    try {
      const jobId = await verifierService.createVerificationJob(orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'VERIFIED' },
      });

      return {
        jobId,
        verifierFee: config.VERIFIER_FEE_USDC,
        status: 'verification_initiated',
      };
    } catch (error) {
      logger.error({ err: error }, 'Hire verifier error');
      throw error;
    }
  }
}

export default new AgentService();
