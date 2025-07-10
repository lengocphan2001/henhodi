# 🔧 502 Bad Gateway Error - Troubleshooting Guide

## 🚨 Quick Diagnostic Steps

Run these commands on your VPS to identify the issue:

### 1. Check if PM2 processes are running
```bash
pm2 status
```

**Expected output:**
```
┌─────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ henhodi-backend     │ default     │ N/A     │ fork    │ 1234     │ 2D     │ 0    │ online    │ 0%       │ 45.0mb   │ root     │ disabled │
│ 1   │ henhodi-frontend    │ default     │ N/A     │ fork    │ 5678     │ 2D     │ 0    │ online    │ 0%       │ 120.0mb  │ root     │ disabled │
└─────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### 2. Check if ports are listening
```bash
sudo netstat -tlnp | grep -E ':(3000|3001)'
```

**Expected output:**
```
tcp6       0      0 :::3000                 :::*                    LISTEN      1234/node
tcp6       0      0 :::3001                 :::*                    LISTEN      5678/node
```

### 3. Check PM2 logs for errors
```bash
pm2 logs --lines 50
```

### 4. Check Nginx status
```bash
sudo systemctl status nginx
```

### 5. Check Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## 🔍 Common Issues and Solutions

### Issue 1: PM2 Processes Not Running

**Symptoms:** `pm2 status` shows processes as "stopped" or "errored"

**Solution:**
```bash
# Stop all processes
pm2 stop all
pm2 delete all

# Start fresh
cd /var/www/blackphuquoc.com
pm2 start ecosystem.config.js

# Check status
pm2 status
```

### Issue 2: Port Conflicts

**Symptoms:** `netstat` shows no processes on ports 3000/3001

**Solution:**
```bash
# Kill any processes using these ports
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp

# Restart PM2
pm2 restart all
```

### Issue 3: Database Connection Issues

**Symptoms:** Backend logs show database connection errors

**Solution:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL if stopped
sudo systemctl start mysql

# Test database connection
mysql -u henhodi_user -p henhodi_db

# Check backend .env file
cat /var/www/blackphuquoc.com/backend/.env
```

### Issue 4: Permission Issues

**Symptoms:** PM2 logs show "permission denied" errors

**Solution:**
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/blackphuquoc.com

# Fix permissions
chmod -R 755 /var/www/blackphuquoc.com
chmod 644 /var/www/blackphuquoc.com/backend/.env
```

### Issue 5: Nginx Configuration Issues

**Symptoms:** Nginx error logs show configuration problems

**Solution:**
```bash
# Test Nginx configuration
sudo nginx -t

# If errors, check the config file
sudo nano /etc/nginx/sites-available/blackphuquoc.com

# Reload Nginx
sudo systemctl reload nginx
```

### Issue 6: Frontend Build Issues

**Symptoms:** Frontend process fails to start

**Solution:**
```bash
cd /var/www/blackphuquoc.com

# Rebuild frontend
npm run build

# Check if build directory exists
ls -la build/

# Restart frontend
pm2 restart henhodi-frontend
```

## 🛠️ Complete Reset Procedure

If nothing else works, follow this complete reset:

### Step 1: Stop Everything
```bash
# Stop PM2
pm2 stop all
pm2 delete all

# Stop Nginx
sudo systemctl stop nginx

# Stop MySQL
sudo systemctl stop mysql
```

### Step 2: Clean and Restart
```bash
# Start MySQL
sudo systemctl start mysql

# Go to app directory
cd /var/www/blackphuquoc.com

# Reinstall dependencies
cd backend && npm install
cd .. && npm install

# Rebuild frontend
npm run build

# Start PM2
pm2 start ecosystem.config.js

# Start Nginx
sudo systemctl start nginx
```

### Step 3: Verify Everything
```bash
# Check PM2 status
pm2 status

# Check ports
sudo netstat -tlnp | grep -E ':(3000|3001)'

# Test backend directly
curl http://localhost:3000/api/health

# Test frontend directly
curl http://localhost:3001

# Test through Nginx
curl http://blackphuquoc.com/api/health
```

## 🔧 Manual Testing Commands

### Test Backend API Directly
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"OK","message":"Henhodi API is running","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Test Frontend Directly
```bash
# Test frontend
curl http://localhost:3001

# Should return HTML content
```

### Test Database Connection
```bash
# Test MySQL connection
mysql -u henhodi_user -p henhodi_db -e "SELECT 1;"

# Expected output: 1
```

## 📋 Environment File Checklist

### Backend .env (/var/www/blackphuquoc.com/backend/.env)
```env
DB_HOST=localhost
DB_USER=henhodi_user
DB_PASSWORD=your_secure_password_here
DB_NAME=henhodi_db
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=production
```

### Frontend env.production (/var/www/blackphuquoc.com/env.production)
```env
REACT_APP_API_URL=http://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
```

## 🚨 Emergency Commands

If you need to quickly get the site working:

```bash
# Quick restart everything
pm2 restart all && sudo systemctl reload nginx

# Check if it's working
curl -I http://blackphuquoc.com

# If still not working, check logs immediately
pm2 logs --lines 20
sudo tail -20 /var/log/nginx/error.log
```

## 📞 Next Steps

If you're still getting 502 errors after following this guide:

1. **Share the output** of these commands:
   - `pm2 status`
   - `pm2 logs --lines 20`
   - `sudo tail -20 /var/log/nginx/error.log`
   - `sudo netstat -tlnp | grep -E ':(3000|3001)'`

2. **Check your domain DNS** - make sure it points to your VPS IP

3. **Verify firewall settings** - ensure ports 80, 443, 3000, and 3001 are open

4. **Check VPS resources** - ensure you have enough RAM and CPU 

## 🚨 **Quick Fix - Run these commands on your VPS:**

```bash
```

## 🔧 **Two Solutions Available:**

### **Solution 1: Use serve package (Recommended)**
This serves the built React files instead of trying to run the development server.

### **Solution 2: Use Nginx to serve static files**
This eliminates the need for a frontend PM2 process entirely.

## 📋 **What to do next:**

1. **Run the quick fix commands above**
2. **Check the PM2 status:** `pm2 status`
3. **Test your site:** `curl http://blackphuquoc.com`
4. **If it works, you're done!**

The issue was that your PM2 configuration was trying to run `npm start` (development server) instead of serving the production build. The `react-scripts` error occurred because the dependencies weren't properly installed or the development server isn't suitable for production.

Try the quick fix first, and let me know if you need help with any of the steps! 