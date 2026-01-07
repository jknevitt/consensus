#!/bin/bash

echo "=================================="
echo "Starting AI Parliament - DEMO MODE (No API Key Required)"
echo "=================================="
echo ""
echo "⚠️  This uses simulated responses, not real AI"
echo "For real AI-powered deliberations, use start-local.sh"
echo ""

# Get local IP
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "📡 Starting simulated backend on port 3001..."
npx tsx src/server.ts &
BACKEND_PID=$!

sleep 3

echo "🌐 Starting frontend on port 3000..."
cd web
npm run dev -- --host &
FRONTEND_PID=$!

sleep 3

echo ""
echo "✅ AI Parliament is running in DEMO mode!"
echo ""
echo "=================================="
echo "Access the parliament at:"
echo "=================================="
echo ""
echo "🖥️  This computer:"
echo "   http://localhost:3000"
echo ""
echo "📱 Other devices on your network:"
echo "   http://$LOCAL_IP:3000"
echo ""
echo "=================================="
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
