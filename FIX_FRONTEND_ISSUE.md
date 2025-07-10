# 🔧 Fix: react-scripts not found - Frontend PM2 Error

## 🚨 Problem Identified

The error shows:
```
sh: 1: react-scripts: not found
```

This means the frontend dependencies are not properly installed or the build process failed.

## 🛠️ Solution Steps

### Step 1: Stop PM2 and Clean Up
```bash
# Stop all PM2 processes
pm2 stop all
pm2 delete all

# Go to your application directory
cd /var/www/blackphuquoc.com
```

### Step 2: Fix Frontend Dependencies
```bash
# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies fresh
npm install

# Verify react-scripts is installed
npm list react-scripts
```

### Step 3: Build Frontend
```bash
# Build the React app
npm run build

# Verify build directory exists
ls -la build/
```

### Step 4: Check Package.json
Make sure your `package.json` has the correct scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react-scripts": "^5.0.1"
  }
}
```

### Step 5: Alternative - Use Production Build Instead of npm start

The issue might be that `npm start` is trying to run the development server. For production, we should serve the built files. Let's modify the PM2 configuration:

```bash
# Edit the ecosystem.config.js file
nano ecosystem.config.js
```

**Replace the frontend configuration with this:**

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

### Step 6: Install serve package
```bash
# Install serve globally
npm install -g serve

# Or install it locally
npm install --save-dev serve
```

### Step 7: Start PM2 Again
```bash
# Start PM2 with the new configuration
pm2 start ecosystem.config.js

# Check status
pm2 status

# Check logs
pm2 logs
```

## 🔄 Alternative Solution: Use Nginx to Serve Static Files

If the above doesn't work, we can serve the frontend directly with Nginx:

### Step 1: Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Replace with this configuration:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend (serve static files directly)
    location / {
        root /var/www/blackphuquoc.com/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
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
}
```

### Step 2: Update PM2 Configuration (Backend Only)
```bash
nano ecosystem.config.js
```

**Use this simplified configuration:**

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
    }
  ]
};
```

### Step 3: Restart Everything
```bash
# Reload Nginx
sudo systemctl reload nginx

# Start only backend with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status
```

## ✅ Verification Steps

After implementing either solution:

```bash
# Test backend
curl http://localhost:3000/api/health

# Test frontend (if using serve)
curl http://localhost:3001

# Test through domain
curl http://blackphuquoc.com

# Check PM2 status
pm2 status

# Check logs
pm2 logs
```

## 🚨 If Still Having Issues

1. **Check Node.js version:**
   ```bash
   node --version
   npm --version
   ```

2. **Check if you're in the right directory:**
   ```bash
   pwd
   ls -la
   ```

3. **Check package.json exists:**
   ```bash
   cat package.json
   ```

4. **Try installing dependencies with legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

5. **Check available disk space:**
   ```bash
   df -h
   ```

## 📞 Next Steps

If you're still having issues, please share:
1. The output of `npm list react-scripts`
2. The contents of your `package.json`
3. The output of `ls -la /var/www/blackphuquoc.com/`
4. Any new PM2 logs after trying these solutions 