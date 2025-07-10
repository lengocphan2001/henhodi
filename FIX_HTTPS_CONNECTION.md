# 🔧 Fix HTTPS Connection Refused Error

## 🚨 Problem Identified

`curl: (7) Failed to connect to blackphuquoc.com port 443: Connection refused`

This means:
- Nginx isn't listening on port 443
- SSL certificate isn't properly configured
- Firewall might be blocking port 443

## 🔍 Quick Diagnosis

### Step 1: Check if Nginx is listening on port 443
```bash
# Check what ports Nginx is listening on
sudo netstat -tlnp | grep nginx

# Or use ss command
sudo ss -tlnp | grep :443
```

### Step 2: Check Nginx configuration
```bash
# View current Nginx config
sudo cat /etc/nginx/sites-available/blackphuquoc.com

# Test Nginx configuration
sudo nginx -t
```

### Step 3: Check Nginx status
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -20 /var/log/nginx/error.log
```

## 🛠️ Solution: Configure SSL Properly

### Step 1: Install Certbot (if not already installed)
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Get SSL Certificate
```bash
# Get SSL certificate for your domain
sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose option 2 (redirect all traffic to HTTPS)
```

### Step 3: Verify SSL Certificate
```bash
# Check certificate status
sudo certbot certificates

# Test certificate renewal
sudo certbot renew --dry-run
```

### Step 4: Check Updated Nginx Configuration
```bash
# View the updated config (should now include SSL)
sudo cat /etc/nginx/sites-available/blackphuquoc.com
```

**The config should now include something like:**
```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    ssl_certificate /etc/letsencrypt/live/blackphuquoc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blackphuquoc.com/privkey.pem;
    
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

### Step 5: Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check if port 443 is now listening
sudo netstat -tlnp | grep :443
```

## 🔥 Alternative: Manual SSL Configuration

If certbot doesn't work, configure SSL manually:

### Step 1: Create SSL Configuration
```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Use this configuration:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/blackphuquoc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blackphuquoc.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Frontend
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

### Step 2: Test and Reload
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 Check Firewall

### Step 1: Check if port 443 is open
```bash
# Check UFW status
sudo ufw status

# If UFW is active, allow port 443
sudo ufw allow 443/tcp

# Check iptables
sudo iptables -L | grep 443
```

### Step 2: Check if port 443 is listening
```bash
# Check what's listening on port 443
sudo netstat -tlnp | grep :443

# Or use ss
sudo ss -tlnp | grep :443
```

## ✅ Verification Steps

After fixing:

```bash
# Test HTTPS connection
curl -I https://blackphuquoc.com/

# Test HTTP redirect
curl -I http://blackphuquoc.com/

# Check SSL certificate
openssl s_client -connect blackphuquoc.com:443 -servername blackphuquoc.com
```

## 🚨 If Still Having Issues

### Check DNS
```bash
# Make sure DNS points to your server
nslookup blackphuquoc.com
dig blackphuquoc.com
```

### Check VPS Firewall
If you're using a VPS provider (DigitalOcean, AWS, etc.), check their firewall settings in the control panel.

## 📞 Next Steps

1. **Run the certbot command** to set up SSL
2. **Check if port 443 is listening** after SSL setup
3. **Test HTTPS connection** with curl
4. **Open in browser** to verify everything works

**Try the certbot command first:**
```bash
sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com
```

**Let me know what happens when you run this command!** 