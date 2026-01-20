#!/bin/bash

# ⚠️ CRITICAL: RESTART BACKEND WITH NEW CODE
# The backend is running OLD code. New fixes won't work until you restart!

echo "🔴 STOPPING OLD BACKEND..."
kill -9 323 2>/dev/null || echo "Process already stopped"

# Wait a moment
sleep 2

echo ""
echo "🟢 STARTING BACKEND WITH NEW CODE..."
cd /Users/prakharmishra/Desktop/AgentShop/backend

# Start backend in background
npm run dev &

echo ""
echo "✅ Backend restarting with FIXED code!"
echo ""
echo "⏳ Wait 10 seconds for 'Server listening on port 3001'"
echo ""
echo "📋 Then:"
echo "   1. Refresh browser (Cmd+Shift+R)"
echo "   2. Go to marketplace"
echo "   3. Try purchasing"
echo ""
echo "🎯 All 500 errors should be FIXED!"
