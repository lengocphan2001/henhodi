# 🔧 Fix Path Issue - Application in henhodi Subfolder

## 🚨 Problem Identified

Your application is located in:
- `/var/www/blackphuquoc.com/henhodi/` (not `/var/www/blackphuquoc.com/`)

But Nginx is looking for files in:
- `/var/www/blackphuquoc.com/build/`

This causes:
- 404 errors for static files
- 500 errors due to missing files
- Internal redirection cycles

## 🛠️ Solution: Fix Nginx Configuration

### Step 1: Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Replace with this corrected configuration:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (serve static files from henhodi subfolder)
    location / {
        root /var/www/blackphuquoc.com/henhodi/build;
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
        alias /var/www/blackphuquoc.com/henhodi/backend/uploads;
    }
}
```

### Step 2: Update PM2 Configuration
```bash
cd /var/www/blackphuquoc.com/henhodi
nano ecosystem.config.js
```

**Update the paths in ecosystem.config.js:**

```javascript
module.exports = {
  apps: [
    {
      name: 'henhodi-backend',
      cwd: '/var/www/blackphuquoc.com/henhodi/backend',
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_file: '/var/www/blackphuquoc.com/henhodi/backend/.env'
    },
    {
      name: 'henhodi-frontend',
      cwd: '/var/www/blackphuquoc.com/henhodi',
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

### Step 3: Fix File Permissions
```bash
# Fix ownership for the entire directory
sudo chown -R $USER:$USER /var/www/blackphuquoc.com

# Fix permissions
chmod -R 755 /var/www/blackphuquoc.com
```

### Step 4: Verify Build Directory
```bash
# Go to the correct directory
cd /var/www/blackphuquoc.com/henhodi

# Check if build exists
ls -la build/

# If build doesn't exist, rebuild
if [ ! -d "build" ]; then
    echo "Build directory missing, rebuilding..."
    npm run build
fi
```

### Step 5: Test and Reload
```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart PM2 with correct paths
cd /var/www/blackphuquoc.com/henhodi
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js

# Check status
pm2 status
```

## 🔄 Alternative: Move Files to Correct Location

If you prefer to keep the original Nginx configuration, you can move the files:

### Option 1: Move henhodi contents to parent directory
```bash
# Move everything from henhodi to parent
cd /var/www/blackphuquoc.com
mv henhodi/* .
mv henhodi/.* . 2>/dev/null || true
rmdir henhodi

# Rebuild
npm run build
```

### Option 2: Create symlink
```bash
# Create symlink from parent to henhodi
cd /var/www/blackphuquoc.com
ln -s henhodi/build build
ln -s henhodi/backend backend
```

## 🔍 Verify the Fix

### Step 1: Test Static Files
```bash
# Test if static files are accessible
curl http://blackphuquoc.com/static/js/bundle.js | head -5
curl http://blackphuquoc.com/favicon.ico
```

### Step 2: Test Main Page
```bash
# Test the main page
curl http://blackphuquoc.com
```

### Step 3: Test API
```bash
# Test backend API
curl http://blackphuquoc.com/api/health
```

## ✅ Expected Results

After fixing:
- ✅ No more 404 errors for favicon.ico
- ✅ No more internal redirection cycles
- ✅ Static files load correctly
- ✅ React app renders properly
- ✅ API calls work

## 📞 Next Steps

1. **Update the Nginx configuration** with the correct paths
2. **Update the PM2 configuration** with the correct paths
3. **Test the website** in your browser
4. **Check for any remaining errors** in the browser console

**Try the Nginx configuration fix first, and let me know if you still see any errors!** 