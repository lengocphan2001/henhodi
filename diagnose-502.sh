#!/bin/bash

# 502 Error Diagnostic Script for blackphuquoc.com
# Run this script on your VPS to diagnose the 502 Bad Gateway error

echo "🔍 Diagnosing 502 Bad Gateway Error for blackphuquoc.com"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "1. Checking PM2 Status..."
echo "------------------------"
pm2 status
echo ""

echo "2. Checking Port Usage..."
echo "------------------------"
echo "Port 3000 (Backend):"
sudo netstat -tlnp | grep :3000 || echo "No process on port 3000"
echo ""
echo "Port 3001 (Frontend):"
sudo netstat -tlnp | grep :3001 || echo "No process on port 3001"
echo ""

echo "3. Checking Nginx Status..."
echo "---------------------------"
sudo systemctl status nginx --no-pager -l
echo ""

echo "4. Checking Recent PM2 Logs..."
echo "------------------------------"
pm2 logs --lines 10 --nostream
echo ""

echo "5. Checking Nginx Error Logs..."
echo "-------------------------------"
sudo tail -10 /var/log/nginx/error.log
echo ""

echo "6. Testing Backend Directly..."
echo "------------------------------"
if curl -s http://localhost:3000/api/health > /dev/null; then
    print_status "Backend is responding on localhost:3000"
    curl -s http://localhost:3000/api/health | head -1
else
    print_error "Backend is NOT responding on localhost:3000"
fi
echo ""

echo "7. Testing Frontend Directly..."
echo "-------------------------------"
if curl -s http://localhost:3001 > /dev/null; then
    print_status "Frontend is responding on localhost:3001"
else
    print_error "Frontend is NOT responding on localhost:3001"
fi
echo ""

echo "8. Testing Through Domain..."
echo "----------------------------"
if curl -s http://blackphuquoc.com > /dev/null; then
    print_status "Domain is responding"
else
    print_error "Domain is NOT responding"
fi
echo ""

echo "9. Checking MySQL Status..."
echo "---------------------------"
sudo systemctl status mysql --no-pager -l
echo ""

echo "10. Checking Environment Files..."
echo "--------------------------------"
echo "Backend .env exists:"
if [ -f "/var/www/blackphuquoc.com/backend/.env" ]; then
    print_status "✓ Backend .env file exists"
    echo "Port in .env: $(grep PORT /var/www/blackphuquoc.com/backend/.env || echo 'PORT not found')"
else
    print_error "✗ Backend .env file missing"
fi

echo "Frontend env.production exists:"
if [ -f "/var/www/blackphuquoc.com/env.production" ]; then
    print_status "✓ Frontend env.production file exists"
else
    print_error "✗ Frontend env.production file missing"
fi
echo ""

echo "11. Checking Application Directory..."
echo "------------------------------------"
if [ -d "/var/www/blackphuquoc.com" ]; then
    print_status "✓ Application directory exists"
    echo "Directory contents:"
    ls -la /var/www/blackphuquoc.com/ | head -5
else
    print_error "✗ Application directory missing"
fi
echo ""

echo "12. Checking Build Directory..."
echo "-------------------------------"
if [ -d "/var/www/blackphuquoc.com/build" ]; then
    print_status "✓ Frontend build directory exists"
    echo "Build files:"
    ls -la /var/www/blackphuquoc.com/build/ | head -3
else
    print_error "✗ Frontend build directory missing"
fi
echo ""

echo "=================================================="
echo "🔧 Quick Fix Commands:"
echo "=================================================="
echo ""
echo "If PM2 processes are not running:"
echo "  pm2 start ecosystem.config.js"
echo ""
echo "If ports are not listening:"
echo "  pm2 restart all"
echo ""
echo "If Nginx is not working:"
echo "  sudo systemctl restart nginx"
echo ""
echo "If MySQL is not running:"
echo "  sudo systemctl start mysql"
echo ""
echo "Complete reset:"
echo "  pm2 stop all && pm2 delete all && pm2 start ecosystem.config.js"
echo ""
echo "Check logs for more details:"
echo "  pm2 logs --lines 50"
echo "  sudo tail -f /var/log/nginx/error.log" 