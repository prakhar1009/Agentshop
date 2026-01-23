import prisma from '../config/database';

async function createBudget() {
  const walletAddress = '0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2';
  
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      console.log('Creating user...');
      user = await prisma.user.create({
        data: {
          walletAddress,
          role: 'BUYER',
        },
      });
      console.log('✅ User created:', user.id);
    } else {
      console.log('✅ User exists:', user.id);
    }

    // Check if budget exists
    const existingBudget = await prisma.agentBudget.findUnique({
      where: { userId: user.id },
    });

    if (existingBudget) {
      console.log('✅ Budget already exists, updating...');
      const updated = await prisma.agentBudget.update({
        where: { userId: user.id },
        data: {
          dailyLimitUSDC: '10.00',
          spentTodayUSDC: '0.00',
          lastResetAt: new Date(),
        },
      });
      console.log('✅ Budget updated:', updated);
    } else {
      console.log('Creating budget...');
      const budget = await prisma.agentBudget.create({
        data: {
          userId: user.id,
          dailyLimitUSDC: '10.00',
          spentTodayUSDC: '0.00',
          lastResetAt: new Date(),
        },
      });
      console.log('✅ Budget created:', budget);
    }

    console.log('\n🎉 SUCCESS! Agent budget is now set to $10.00 USDC');
    console.log('Now you can use "buy the api" command in agent chat!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBudget();
