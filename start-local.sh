#!/bin/bash

echo "=================================="
echo "Starting AI Parliament - Local Network Mode"
echo "=================================="
echo ""

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  WARNING: ANTHROPIC_API_KEY not set!"
    echo ""
    echo "The server will start, but AI deliberations won't work."
    echo "Set your API key with:"
    echo "  export ANTHROPIC_API_KEY=sk-ant-your-key-here"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to cancel..."
fi

# Get local IP
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "📡 Starting backend on port 3001..."
npx tsx src/server-ai.ts &
BACKEND_PID=$!

sleep 3

echo "🌐 Starting frontend on port 3000..."
cd web
npm run dev -- --host &
FRONTEND_PID=$!

sleep 3

echo ""
echo "✅ AI Parliament is running!"
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
