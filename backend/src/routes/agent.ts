import { FastifyInstance } from 'fastify';
import agentService from '../services/agentService';
import prisma from '../config/database';
import { agentExecuteSchema, setBudgetSchema } from '../utils/validation';
import logger from '../config/logger';

export default async function agentRoutes(fastify: FastifyInstance) {
  fastify.post('/api/agent/execute', async (request, reply) => {
    try {
      const data = agentExecuteSchema.parse(request.body);

      const result = await agentService.executeAgentTask(data.userId, data.prompt);

      if (result.success && result.result?.orderId) {
        // Only create execution record if there's a valid order
        try {
          await prisma.agentExecution.create({
            data: {
              orderId: result.result.orderId,
              userPrompt: data.prompt,
              reasoningSteps: JSON.stringify(result.reasoningSteps),
              toolCallsJson: JSON.stringify(result.reasoningSteps.filter(s => s.type === 'tool_call')),
              totalCostUSDC: '0.00',
              executionTimeMs: Date.now() - result.reasoningSteps[0].timestamp,
              success: true,
            },
          });
        } catch (execError) {
          logger.warn({ err: execError }, 'Failed to create agent execution record');
          // Don't fail the whole request if execution logging fails
        }
      }

      return reply.send({
        success: result.success,
        reasoningSteps: result.reasoningSteps,
        result: result.result,
        error: result.error,
      });
    } catch (error) {
      logger.error({ err: error }, 'Error executing agent task');
      return reply.code(500).send({ error: 'Failed to execute agent task' });
    }
  });

  fastify.post('/api/agent/budget', async (request, reply) => {
    try {
      const data = setBudgetSchema.parse(request.body);

      // Auto-create user if doesn't exist (data.userId is walletAddress)
      let user = await prisma.user.findUnique({
        where: { walletAddress: data.userId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress: data.userId,
            role: 'BUYER',
          },
        });
        logger.info(`Auto-created user: ${data.userId}`);
      }

      const budget = await prisma.agentBudget.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          dailyLimitUSDC: data.dailyLimitUSDC,
          perTxLimitUSDC: data.perTxLimitUSDC,
          spentTodayUSDC: '0',
          categoriesJson: data.categoriesJson,
        },
        update: {
          dailyLimitUSDC: data.dailyLimitUSDC,
          perTxLimitUSDC: data.perTxLimitUSDC,
          categoriesJson: data.categoriesJson,
        },
      });

      logger.info(`Budget set for user: ${data.userId}`);

      return reply.send({
        userId: data.userId,
        dailyLimitUSDC: budget.dailyLimitUSDC,
        perTxLimitUSDC: budget.perTxLimitUSDC,
        spentTodayUSDC: budget.spentTodayUSDC,
      });
    } catch (error) {
      logger.error({ err: error }, 'Error setting budget');
      return reply.code(500).send({ error: 'Failed to set budget' });
    }
  });

  fastify.get('/api/agent/budget/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };

      // userId is walletAddress, find user first
      const user = await prisma.user.findUnique({
        where: { walletAddress: userId },
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const budget = await prisma.agentBudget.findUnique({
        where: { userId: user.id },
      });

      if (!budget) {
        return reply.code(404).send({ error: 'Budget not found' });
      }

      return reply.send({
        userId,
        dailyLimitUSDC: budget.dailyLimitUSDC,
        perTxLimitUSDC: budget.perTxLimitUSDC,
        spentTodayUSDC: budget.spentTodayUSDC,
        remainingUSDC: (parseFloat(budget.dailyLimitUSDC) - parseFloat(budget.spentTodayUSDC)).toFixed(2),
      });
    } catch (error) {
      logger.error({ err: error }, 'Error fetching budget');
      return reply.code(500).send({ error: 'Failed to fetch budget' });
    }
  });
}
