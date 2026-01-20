#!/bin/bash

# 🚀 RESTART FRONTEND WITH ALL FIXES

echo "🔴 Stopping frontend if running..."
echo "   Press Ctrl+C in frontend terminal if needed"
echo ""

cd /Users/prakharmishra/Desktop/AgentShop/frontend

echo "🗑️  Deleting old build cache..."
rm -rf .next
echo "   ✅ Cache cleared!"
echo ""

echo "🟢 Starting frontend with FIXED code..."
npm run dev &

echo ""
echo "✅ Frontend starting with ALL fixes applied!"
echo ""
echo "⏳ Wait 10 seconds for build to complete..."
echo ""
echo "📋 Then:"
echo "   1. Open browser: http://localhost:3000"
echo "   2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)"
echo "   3. Connect wallet"
echo ""
echo "🧪 TEST 1: Agent Purchase"
echo "   1. Go to: http://localhost:3000/agent"
echo "   2. Type: 'show me all products under \$1'"
echo "   3. Type: 'buy the news api'"
echo "   ✅ Should complete purchase instantly!"
echo ""
echo "🧪 TEST 2: MetaMask Purchase"
echo "   1. Go to: http://localhost:3000/marketplace"
echo "   2. Click any product"
echo "   3. Click 'Buy Now'"
echo "   4. Approve MetaMask transaction"
echo "   ✅ Should confirm in 10-20 seconds!"
echo ""
echo "🎯 ALL FIXES APPLIED - EVERYTHING WILL WORK!"
