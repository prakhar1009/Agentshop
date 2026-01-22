import { FastifyInstance } from 'fastify';
import prisma from '../config/database';
import logger from '../config/logger';
import OpenAI from 'openai';
import config from '../config';

export default async function langGraphAgentRoutes(fastify: FastifyInstance) {
  const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

  fastify.post('/api/agent/langgraph', async (request, reply) => {
    try {
      const { prompt, userId, userAddress } = request.body as {
        prompt: string;
        userId: string;
        userAddress?: string;
      };

      const messages: Array<{ role: string; content: string; timestamp: number; metadata?: any }> = [];
      let needsMetaMask = false;
      let order: any = null;

      // Step 1: Analyze intent
      messages.push({
        role: 'assistant',
        content: `🧠 Analyzing your request...`,
        timestamp: Date.now(),
      });

      const intentPrompt = `Analyze this user request and determine what they want:
"${prompt}"

If they want to BUY something (e.g., "buy the api", "purchase weather key", "get it"), extract what product they're looking for.
If they just want to SEARCH/BROWSE (e.g., "show me apis"), just extract the search term.

Respond with ONLY JSON:
{
  "action": "buy" or "search",
  "searchQuery": "what to search for"
}`;

      const intentResponse = await openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages: [{ role: 'user', content: intentPrompt }],
        temperature: 0.2,
      });

      // Parse JSON response, handling markdown code blocks
      let rawContent = intentResponse.choices[0].message.content || '{}';
      // Remove markdown code blocks if present
      rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const intent = JSON.parse(rawContent);
      logger.info({ intent }, 'LangGraph intent analysis');

      // Step 2: Search products
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: intent.searchQuery || '', mode: 'insensitive' } },
            { description: { contains: intent.searchQuery || '', mode: 'insensitive' } },
          ],
          active: true,
        },
        include: {
          merchant: {
            select: {
              walletAddress: true,
            },
          },
        },
        take: 5,
      });

      if (products.length === 0) {
        messages.push({
          role: 'assistant',
          content: `❌ No products found matching "${intent.searchQuery}"`,
          timestamp: Date.now(),
        });
        return reply.send({ success: false, messages, error: 'No products found' });
      }

      // Show products
      const productList = products.map((p, i) => 
        `${i + 1}. **${p.name}** - $${p.priceUSDC}\n   Merchant: ${p.merchant.walletAddress.substring(0, 8)}...`
      ).join('\n\n');

      messages.push({
        role: 'assistant',
        content: `📦 Found ${products.length} product(s):\n\n${productList}`,
        timestamp: Date.now(),
      });

      // If user wants to BUY (not just search), continue
      if (intent.action === 'buy') {
        // Step 3: Select best product (first one for now)
        const selectedProduct = products[0];

        messages.push({
          role: 'assistant',
          content: `✅ Selected: **${selectedProduct.name}** - $${selectedProduct.priceUSDC}`,
          timestamp: Date.now(),
        });

        // Step 4: Check budget
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            agentBudget: true,
          },
        });

        if (!user?.agentBudget) {
          messages.push({
            role: 'assistant',
            content: `⚠️ Please set your agent budget first!`,
            timestamp: Date.now(),
          });
          return reply.send({ success: false, messages, error: 'No budget set' });
        }

        const remaining = parseFloat(user.agentBudget.dailyLimitUSDC) - parseFloat(user.agentBudget.spentTodayUSDC);
        const productPrice = parseFloat(selectedProduct.priceUSDC);

        if (remaining < productPrice) {
          messages.push({
            role: 'assistant',
            content: `❌ Insufficient budget! Need $${productPrice}, have $${remaining.toFixed(2)}`,
            timestamp: Date.now(),
          });
          return reply.send({ success: false, messages, error: 'Insufficient budget' });
        }

        messages.push({
          role: 'assistant',
          content: `💰 Budget check passed: $${remaining.toFixed(2)} available`,
          timestamp: Date.now(),
        });

        // Step 5: Create purchase order
        order = await prisma.order.create({
          data: {
            buyerId: userId,
            productId: selectedProduct.id,
            amountUSDC: selectedProduct.priceUSDC,
            status: 'PENDING_PAYMENT',
          },
          include: {
            product: {
              include: {
                merchant: true,
              },
            },
          },
        });

        // Signal frontend to trigger MetaMask
        needsMetaMask = true;

        messages.push({
          role: 'assistant',
          content: `🔐 **Ready to purchase!**\n\nPlease confirm the transaction in MetaMask:\n\n• Product: ${selectedProduct.name}\n• Amount: $${selectedProduct.priceUSDC} USDC\n• Merchant: ${order.product.merchant.walletAddress}`,
          timestamp: Date.now(),
          metadata: {
            triggerMetaMask: true,
            orderId: order.id,
            merchantAddress: order.product.merchant.walletAddress,
            amount: selectedProduct.priceUSDC,
            productName: selectedProduct.name,
          },
        });
      }

      return reply.send({
        success: true,
        messages,
        needsMetaMask,
        order,
        action: intent.action,
      });

    } catch (error) {
      logger.error({ err: error }, 'LangGraph agent error');
      return reply.code(500).send({
        success: false,
        messages: [{
          role: 'assistant',
          content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now(),
        }],
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
