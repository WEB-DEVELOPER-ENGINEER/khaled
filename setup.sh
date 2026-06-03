#!/bin/bash

echo "🚀 Sign2GPT Learning Platform Setup Script"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js installed:${NC} $(node -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "You'll need to use MongoDB Atlas or install MongoDB locally"
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi

cd ..
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    mkdir uploads
    touch uploads/.gitkeep
    echo -e "${GREEN}✅ Uploads directory created${NC}"
fi

echo ""
echo "==========================================="
echo -e "${GREEN}✨ Setup completed successfully!${NC}"
echo "==========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit .env file with your configuration:"
echo "   - MongoDB connection string"
echo "   - JWT secret key"
echo "   - Email credentials (Gmail)"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   $ mongod"
echo ""
echo "3. Start the application:"
echo "   Backend:  npm run dev"
echo "   Frontend: cd frontend && npm start"
echo "   Or both:  npm run dev:full"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - README.md (full documentation)"
echo "   - QUICKSTART.md (quick start guide)"
echo "   - DEPLOYMENT.md (production deployment)"
echo ""
echo -e "${GREEN}Happy learning! 🎉${NC}"
