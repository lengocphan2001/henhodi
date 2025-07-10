# VPS Deployment Guide for blackphuquoc.com

## 🚀 Simple VPS Deployment with npm start

This guide will help you deploy your React frontend and Node.js backend on a VPS using `npm start` for both services.

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ or CentOS 8+
- Domain: blackphuquoc.com (already configured)
- SSH access to your VPS
- Node.js 22.16.0+ installed on VPS

## 🖥️ VPS Setup

### Step 1: Connect to Your VPS
```bash
ssh root@your-vps-ip
```

### Step 2: Update System
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### Step 3: Install Node.js 22.x
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version  # Should show v22.16.0+
npm --version   # Should show 10.0.0+
```

### Step 4: Install MySQL
```bash
# Ubuntu/Debian
sudo apt install mysql-server -y

# CentOS/RHEL
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### Step 5: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Step 6: Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📁 Application Deployment

### Step 1: Create Application Directory
```bash
sudo mkdir -p /var/www/blackphuquoc.com
sudo chown $USER:$USER /var/www/blackphuquoc.com
cd /var/www/blackphuquoc.com
```

### Step 2: Clone Your Repository
```bash
git clone https://github.com/your-username/henhodi.git .
```

### Step 3: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment file
nano .env
```

**Backend .env content:**
```env
DB_HOST=localhost
DB_USER=henhodi_user
DB_PASSWORD=your_secure_password_here
DB_NAME=henhodi_db
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=production
```

```bash
# Setup database
npm run setup-db

# Test backend
npm start
# Press Ctrl+C to stop
```

### Step 4: Setup Frontend
```bash
cd ..

# Install dependencies
npm install

# Create production environment file
nano env.production
```

**Frontend env.production content:**
```env
REACT_APP_API_URL=http://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
```

```bash
# Build frontend
npm run build

# Test frontend
npm start
# Press Ctrl+C to stop
```

## 🔧 Process Management with PM2

### Step 1: Create PM2 Configuration
```bash
cd /var/www/blackphuquoc.com
nano ecosystem.config.js
```

**ecosystem.config.js content:**
```javascript
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
      env_file: '/var/www/blackphuquoc.com/backend/.env'
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
      }
    }
  ]
};
```

### Step 2: Start Applications with PM2
```bash
# Start both applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided
```

### Step 3: Monitor Applications
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

## 🌐 Nginx Configuration

### Step 1: Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Nginx configuration:**
```nginx
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
    
    # Static files (if needed)
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
```

### Step 2: Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/blackphuquoc.com /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

### Step 1: Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### Step 2: Get SSL Certificate
```bash
sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com
```

## 🗄️ Database Setup

### Step 1: Secure MySQL
```bash
sudo mysql_secure_installation
```

### Step 2: Create Database and User
```bash
sudo mysql -u root -p
```

**MySQL commands:**
```sql
CREATE DATABASE henhodi_db;
CREATE USER 'henhodi_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON henhodi_db.* TO 'henhodi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🚀 Start Everything

### Step 1: Start All Services
```bash
# Start PM2 applications
pm2 start ecosystem.config.js

# Start Nginx
sudo systemctl start nginx

# Start MySQL
sudo systemctl start mysql
```

### Step 2: Enable Services on Boot
```bash
# Enable services
sudo systemctl enable nginx
sudo systemctl enable mysql

# Save PM2 configuration
pm2 save
pm2 startup
```

## ✅ Testing Your Deployment

### Step 1: Test Backend API
```bash
curl http://blackphuquoc.com/api/health
```

### Step 2: Test Frontend
Open your browser and visit: `https://blackphuquoc.com`

### Step 3: Check Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## 🔧 Useful Commands

### PM2 Commands
```bash
# Restart applications
pm2 restart all

# Stop applications
pm2 stop all

# Delete applications
pm2 delete all

# Monitor
pm2 monit
```

### Nginx Commands
```bash
# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### Database Commands
```bash
# Backup database
mysqldump -u henhodi_user -p henhodi_db > backup.sql

# Restore database
mysql -u henhodi_user -p henhodi_db < backup.sql
```

## 🆘 Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :3001
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER /var/www/blackphuquoc.com
   ```

3. **Database connection failed:**
   - Check MySQL service: `sudo systemctl status mysql`
   - Check credentials in `.env` file
   - Test connection: `mysql -u henhodi_user -p`

4. **Nginx 502 error:**
   - Check if applications are running: `pm2 status`
   - Check application logs: `pm2 logs`

## 🎉 Success!

Your application should now be live at:
- **Frontend**: https://blackphuquoc.com
- **Backend API**: https://blackphuquoc.com/api

## 📊 Monitoring

Set up basic monitoring:
```bash
# Install monitoring tools
sudo apt install htop iotop -y

# Monitor system resources
htop
```

## 🔄 Updates

To update your application:
```bash
cd /var/www/blackphuquoc.com
git pull
cd backend && npm install
cd .. && npm install && npm run build
pm2 restart all
``` 