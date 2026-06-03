#!/bin/bash

echo "🚀 Starting Sign2GPT Development Servers..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB with: sudo systemctl start mongod"
    echo ""
fi

# Start backend server
echo "📦 Starting Backend Server..."
cd backend && npm install && node server.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"
echo ""

# Wait a bit for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting Frontend Server..."
cd ../frontend && npm install && npm start &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"
echo ""

echo "✅ Both servers are starting!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
