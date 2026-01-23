import prisma from '../config/database';

async function createDemoProducts() {
  const merchantWallet = '0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2';
  
  try {
    // Find or create merchant user
    let merchant = await prisma.user.findUnique({
      where: { walletAddress: merchantWallet },
    });

    if (!merchant) {
      merchant = await prisma.user.create({
        data: {
          walletAddress: merchantWallet,
          role: 'MERCHANT',
        },
      });
      console.log('✅ Merchant created');
    }

    const products = [
      {
        name: 'OpenAI GPT-4 API Access',
        description: 'Premium AI API with GPT-4 Turbo access. 1000 requests/month. Perfect for building intelligent applications with cutting-edge language models.',
        priceUSDC: '5.99',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'CoinGecko Pro API',
        description: 'Real-time cryptocurrency data API. Live prices, market caps, volume for 10,000+ coins. Essential for crypto trading apps.',
        priceUSDC: '3.49',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Weather Intelligence API',
        description: 'Advanced weather forecasting API. 7-day forecasts, historical data, severe weather alerts. Used by Fortune 500 companies.',
        priceUSDC: '2.99',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Stripe Payment Gateway',
        description: 'Accept payments globally. Process credit cards, digital wallets, and local payment methods in 135+ currencies.',
        priceUSDC: '4.99',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Twitter/X API Premium',
        description: 'Post tweets, search tweets, analyze trends. Full access to Twitter v2 API endpoints. 10,000 tweets/month.',
        priceUSDC: '7.49',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Google Maps Platform',
        description: 'Geocoding, directions, places, and maps. Build location-aware applications with the world\'s most accurate mapping data.',
        priceUSDC: '3.99',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'SendGrid Email API',
        description: 'Transactional email delivery at scale. 99.9% uptime SLA. Send marketing campaigns and notifications reliably.',
        priceUSDC: '2.49',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Twilio SMS Gateway',
        description: 'Send and receive SMS globally. Two-factor authentication, notifications, marketing messages. 200+ countries supported.',
        priceUSDC: '4.49',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'News API Premium',
        description: 'Live breaking news from 80,000+ sources worldwide. Filter by topic, sentiment, language. Perfect for news aggregators.',
        priceUSDC: '3.99',
        deliveryType: 'INSTANT',
        active: true,
      },
      {
        name: 'Stock Market Data Pro',
        description: 'Real-time stock quotes, historical data, company fundamentals. NYSE, NASDAQ, and global markets. Institutional-grade data.',
        priceUSDC: '8.99',
        deliveryType: 'INSTANT',
        active: true,
      },
    ];

    console.log('\n🚀 Creating demo products...\n');

    for (const productData of products) {
      const existing = await prisma.product.findFirst({
        where: {
          name: productData.name,
          merchantId: merchant.id,
        },
      });

      if (existing) {
        console.log(`⏭️  Skip: ${productData.name} (already exists)`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          merchantId: merchant.id,
        },
      });

      console.log(`✅ Created: ${product.name} - $${product.priceUSDC}`);
    }

    console.log('\n🎉 SUCCESS! Demo products created!');
    console.log('\n📊 Product Categories:');
    console.log('   • AI & ML (GPT-4)');
    console.log('   • Crypto Data (CoinGecko)');
    console.log('   • Weather & Climate');
    console.log('   • Payments (Stripe)');
    console.log('   • Social Media (Twitter/X)');
    console.log('   • Maps & Location (Google)');
    console.log('   • Email (SendGrid)');
    console.log('   • Messaging (Twilio)');
    console.log('   • News & Media');
    console.log('   • Finance (Stock Market)');
    console.log('\n💡 Now you can test:');
    console.log('   "buy GPT-4 API"');
    console.log('   "find crypto data APIs"');
    console.log('   "show me all products under $5"');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoProducts();
