#!/bin/bash

# Deployment Script for blackphuquoc.com
# This script helps deploy both frontend and backend

set -e

echo "🚀 Starting deployment for blackphuquoc.com..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="22.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_warning "Node.js version $NODE_VERSION detected. Recommended version is $REQUIRED_VERSION or higher."
    print_warning "Your current version should work, but consider upgrading for best compatibility."
else
    print_status "Node.js version $NODE_VERSION is compatible."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Installing frontend dependencies..."
npm install

print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Backend deployment
print_status "Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

print_status "Installing backend dependencies..."
npm install

print_status "Setting up database..."
npm run setup-db

print_status "Backend setup complete!"

# Return to root
cd ..

print_status "Deployment preparation complete!"
echo ""
print_status "Next steps:"
echo "1. Choose your deployment platform:"
echo "   - Vercel (recommended): Run 'vercel --prod'"
echo "   - Netlify: Connect your GitHub repo"
echo "   - VPS: Follow the VPS deployment guide in DEPLOYMENT.md"
echo ""
echo "2. Configure your domain DNS settings"
echo "3. Set up environment variables"
echo "4. Test the deployment"
echo ""
print_status "For detailed instructions, see DEPLOYMENT.md" 