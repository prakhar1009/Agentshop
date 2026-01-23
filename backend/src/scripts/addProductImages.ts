import prisma from '../config/database';

async function addProductImages() {
  const productImages = [
    {
      name: 'OpenAI GPT-4 API Access',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      metadata: { icon: '🤖', category: 'AI & ML', featured: true }
    },
    {
      name: 'CoinGecko Pro API',
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
      metadata: { icon: '₿', category: 'Crypto Data', featured: true }
    },
    {
      name: 'Weather Intelligence API',
      imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop',
      metadata: { icon: '⛅', category: 'Weather & Climate', featured: false }
    },
    {
      name: 'Stripe Payment Gateway',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      metadata: { icon: '💳', category: 'Payments', featured: true }
    },
    {
      name: 'Twitter/X API Premium',
      imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop',
      metadata: { icon: '🐦', category: 'Social Media', featured: true }
    },
    {
      name: 'Google Maps Platform',
      imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop',
      metadata: { icon: '🗺️', category: 'Maps & Location', featured: false }
    },
    {
      name: 'SendGrid Email API',
      imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop',
      metadata: { icon: '📧', category: 'Email', featured: false }
    },
    {
      name: 'Twilio SMS Gateway',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      metadata: { icon: '💬', category: 'Messaging', featured: false }
    },
    {
      name: 'News API Premium',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
      metadata: { icon: '📰', category: 'News & Media', featured: false }
    },
    {
      name: 'Stock Market Data Pro',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
      metadata: { icon: '📈', category: 'Finance', featured: true }
    },
  ];

  console.log('\n🎨 Adding product images...\n');

  try {
    for (const productData of productImages) {
      const product = await prisma.product.findFirst({
        where: { name: productData.name }
      });

      if (!product) {
        console.log(`⏭️  Skip: ${productData.name} (not found)`);
        continue;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          metadataJson: JSON.stringify({
            imageUrl: productData.imageUrl,
            ...productData.metadata
          })
        }
      });

      console.log(`✅ Updated: ${productData.name}`);
      console.log(`   Image: ${productData.imageUrl.substring(0, 60)}...`);
    }

    console.log('\n🎉 SUCCESS! Product images added!');
    console.log('\n📸 All products now have professional images');
    console.log('💡 Refresh your marketplace to see the changes');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addProductImages();
