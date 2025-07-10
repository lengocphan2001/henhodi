# 🔧 Fix 500 Internal Server Error

## 🚨 Problem Identified

You're getting a 500 Internal Server Error, which means:
- Nginx is running but encountering an error
- The configuration might have syntax errors
- File permissions or paths might be incorrect

## 🔍 Quick Diagnosis

### Step 1: Check Nginx Error Logs
```bash
# Check the most recent errors
sudo tail -20 /var/log/nginx/error.log
```

### Step 2: Check Nginx Configuration
```bash
# Test Nginx configuration
sudo nginx -t
```

### Step 3: Check File Permissions and Paths
```bash
# Check if the build directory exists
ls -la /var/www/blackphuquoc.com/build/

# Check permissions
ls -la /var/www/blackphuquoc.com/
```

## 🛠️ Solution Steps

### Step 1: Fix File Permissions
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/blackphuquoc.com

# Fix permissions
chmod -R 755 /var/www/blackphuquoc.com
chmod 644 /var/www/blackphuquoc.com/build/index.html
```

### Step 2: Verify Build Directory
```bash
cd /var/www/blackphuquoc.com

# Check if build exists
ls -la build/

# If build doesn't exist, rebuild
if [ ! -d "build" ]; then
    echo "Build directory missing, rebuilding..."
    npm run build
fi
```

### Step 3: Check Nginx Configuration Syntax
```bash
# Test configuration
sudo nginx -t

# If there are errors, check the config file
sudo cat /etc/nginx/sites-available/blackphuquoc.com
```

### Step 4: Fix Nginx Configuration (if needed)
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Use this simplified configuration:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (serve static files directly)
    location / {
        root /var/www/blackphuquoc.com/build;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Uploads
    location /uploads {
        alias /var/www/blackphuquoc.com/backend/uploads;
    }
}
```

### Step 5: Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# If test passes, reload
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

## 🔄 Alternative: Use PM2 Approach (If Nginx static serving doesn't work)

### Step 1: Revert to PM2 Configuration
```bash
# Update Nginx to proxy to PM2
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Use this configuration:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (proxy to PM2)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Uploads
    location /uploads {
        alias /var/www/blackphuquoc.com/backend/uploads;
    }
}
```

### Step 2: Start Frontend with PM2
```bash
# Make sure serve is installed
npm install -g serve

# Start frontend with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status
```

### Step 3: Reload Nginx
```bash
sudo systemctl reload nginx
```

## 🔍 Debugging Commands

### Check What's Happening
```bash
# Check Nginx error logs in real-time
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log

# Test backend directly
curl http://localhost:3000/api/health

# Test frontend directly (if using PM2)
curl http://localhost:3001
```

### Check File Structure
```bash
# Check the complete file structure
tree /var/www/blackphuquoc.com/ -L 3

# Or use ls
ls -la /var/www/blackphuquoc.com/
ls -la /var/www/blackphuquoc.com/build/
```

## 🚨 Common 500 Error Causes

1. **Missing build directory**
2. **Incorrect file permissions**
3. **Nginx configuration syntax errors**
4. **Missing index.html file**
5. **Incorrect file paths**

## ✅ Verification Steps

After fixing:

```bash
# Test Nginx configuration
sudo nginx -t

# Test the website
curl http://blackphuquoc.com

# Check for any remaining errors
sudo tail -5 /var/log/nginx/error.log
```

## 📞 Next Steps

1. **Run the diagnosis commands** to see what's causing the 500 error
2. **Share the Nginx error log output** so I can help identify the specific issue
3. **Try the simplified Nginx configuration** first
4. **If that doesn't work, use the PM2 approach**

**Can you run `sudo tail -20 /var/log/nginx/error.log` and share what errors you see?** 