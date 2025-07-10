# 🔧 Fix 404 Errors - Static Files Not Loading

## 🚨 Problem Identified

You're getting 404 errors for static resources, which means:
- JavaScript files aren't loading
- CSS files aren't loading
- The React app can't function properly

## 🔍 Quick Diagnosis

### Step 1: Check What's Missing
```bash
# Go to your app directory
cd /var/www/blackphuquoc.com

# Check if build directory exists and has content
ls -la build/
ls -la build/static/
```

### Step 2: Check Nginx Configuration
```bash
# View current Nginx config
sudo cat /etc/nginx/sites-available/blackphuquoc.com
```

## 🛠️ Solution: Fix Nginx Configuration

The issue is likely that Nginx isn't properly configured to serve static files. Let's fix this:

### Step 1: Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Replace the entire configuration with this:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (serve static files directly)
    location / {
        root /var/www/blackphuquoc.com/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
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
    
    # Uploads
    location /uploads {
        alias /var/www/blackphuquoc.com/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

### Step 2: Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔄 Alternative: Use PM2 with serve (If Nginx approach doesn't work)

### Step 1: Update PM2 Configuration
```bash
nano ecosystem.config.js
```

**Use this configuration:**

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
      script: 'npx',
      args: 'serve -s build -l 3001',
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

### Step 2: Update Nginx to Proxy to PM2
```bash
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
    
    # Uploads
    location /uploads {
        alias /var/www/blackphuquoc.com/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### Step 3: Restart Everything
```bash
# Install serve if not already installed
npm install -g serve

# Restart PM2
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx
```

## 🔍 Verify the Fix

### Step 1: Check Build Files
```bash
cd /var/www/blackphuquoc.com
ls -la build/static/js/
ls -la build/static/css/
```

### Step 2: Test Static Files Directly
```bash
# Test if static files are accessible
curl http://localhost:3001/static/js/bundle.js | head -5
curl http://localhost:3001/static/css/main.css | head -5
```

### Step 3: Test Through Domain
```bash
# Test the main page
curl http://blackphuquoc.com

# Test static files through domain
curl http://blackphuquoc.com/static/js/bundle.js | head -5
```

## 🚨 If Still Having Issues

### Check File Permissions
```bash
# Fix permissions
sudo chown -R $USER:$USER /var/www/blackphuquoc.com
chmod -R 755 /var/www/blackphuquoc.com/build/
```

### Check if Build is Complete
```bash
# Rebuild the frontend
cd /var/www/blackphuquoc.com
rm -rf build/
npm run build

# Check build output
ls -la build/
```

### Check Nginx Logs
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

## ✅ Success Indicators

After fixing, you should see:
- ✅ No 404 errors in browser console
- ✅ JavaScript files loading (check Network tab)
- ✅ CSS files loading
- ✅ React app rendering properly
- ✅ No "Failed to load resource" errors

## 📞 Next Steps

1. **Try the Nginx static file approach first** (Solution 1)
2. **If that doesn't work, try the PM2 serve approach** (Solution 2)
3. **Test in browser** and check the Network tab for any remaining 404s
4. **Let me know what you see** in the browser console

**Which approach would you like to try first?** 