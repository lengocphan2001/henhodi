#!/bin/bash

# VPS Deployment Script for blackphuquoc.com
# This script will set up your entire application on a VPS

set -e

echo "🚀 Starting VPS deployment for blackphuquoc.com..."

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_step "Step 1: Updating system packages..."
apt update && apt upgrade -y

print_step "Step 2: Installing Node.js 22.x..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node -v)
print_status "Node.js version: $NODE_VERSION"

print_step "Step 3: Installing MySQL..."
apt install mysql-server -y
systemctl start mysql
systemctl enable mysql

print_step "Step 4: Installing PM2..."
npm install -g pm2

print_step "Step 5: Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

print_step "Step 6: Installing Certbot for SSL..."
apt install certbot python3-certbot-nginx -y

print_step "Step 7: Creating application directory..."
mkdir -p /var/www/blackphuquoc.com
cp -r . /var/www/blackphuquoc.com/
chown -R $SUDO_USER:$SUDO_USER /var/www/blackphuquoc.com

print_step "Step 8: Setting up database..."
# Secure MySQL installation
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root_password';"
mysql -e "CREATE DATABASE IF NOT EXISTS henhodi_db;"
mysql -e "CREATE USER IF NOT EXISTS 'henhodi_user'@'localhost' IDENTIFIED BY 'henhodi_password';"
mysql -e "GRANT ALL PRIVILEGES ON henhodi_db.* TO 'henhodi_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

print_step "Step 9: Setting up backend..."
cd /var/www/blackphuquoc.com/backend

# Create backend .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=henhodi_user
DB_PASSWORD=henhodi_password
DB_NAME=henhodi_db
JWT_SECRET=henhodi_jwt_secret_2024
PORT=3000
NODE_ENV=production
EOF

npm install
npm run setup-db

print_step "Step 10: Setting up frontend..."
cd /var/www/blackphuquoc.com

# Create frontend env.production file
cat > env.production << EOF
REACT_APP_API_URL=http://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
EOF

npm install
npm run build

print_step "Step 11: Creating PM2 ecosystem file..."
cd /var/www/blackphuquoc.com
mkdir -p logs

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'henhodi-backend',
      cwd: '/var/www/blackphuquoc.com/backend',
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_file: '/var/www/blackphuquoc.com/backend/.env',
      error_file: '/var/www/blackphuquoc.com/logs/backend-error.log',
      out_file: '/var/www/blackphuquoc.com/logs/backend-out.log',
      log_file: '/var/www/blackphuquoc.com/logs/backend-combined.log',
      time: true
    },
    {
      name: 'henhodi-frontend',
      cwd: '/var/www/blackphuquoc.com',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/www/blackphuquoc.com/logs/frontend-error.log',
      out_file: '/var/www/blackphuquoc.com/logs/frontend-out.log',
      log_file: '/var/www/blackphuquoc.com/logs/frontend-combined.log',
      time: true
    }
  ]
};
EOF

print_step "Step 12: Creating Nginx configuration..."
cat > /etc/nginx/sites-available/blackphuquoc.com << 'EOF'
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (React app)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static {
        alias /var/www/blackphuquoc.com/build/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Uploads
    location /uploads {
        alias /var/www/blackphuquoc.com/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/blackphuquoc.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx

print_step "Step 13: Starting applications with PM2..."
cd /var/www/blackphuquoc.com
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_step "Step 14: Getting SSL certificate..."
certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com --non-interactive --agree-tos --email admin@blackphuquoc.com

print_status "Deployment completed successfully!"
echo ""
print_status "Your application is now running at:"
echo "  🌐 Frontend: https://blackphuquoc.com"
echo "  🔧 Backend API: http://localhost:5000/api"
echo ""
print_status "Useful commands:"
echo "  📊 Check status: pm2 status"
echo "  📝 View logs: pm2 logs"
echo "  🔄 Restart: pm2 restart all"
echo "  🛑 Stop: pm2 stop all"
echo ""
print_warning "Default database credentials:"
echo "  Username: henhodi_user"
echo "  Password: henhodi_password"
echo "  Database: henhodi_db"
echo ""
print_warning "Please change these credentials in production!" 