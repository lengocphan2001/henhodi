# Deployment Guide for blackphuquoc.com

## Overview
This guide will help you deploy your React frontend and Node.js backend to your domain `blackphuquoc.com`.

## Prerequisites
- Domain: blackphuquoc.com
- GitHub repository with your code
- Node.js 22.0.0+ and npm 10.0.0+ installed locally
- Your current Node.js version: 22.16.0 ✅

## Option 1: Vercel Deployment (Recommended)

### Frontend Deployment
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project root:**
   ```bash
   vercel --prod
   ```

4. **Connect your domain:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Domains
   - Add `blackphuquoc.com`
   - Update your DNS records as instructed

### Backend Deployment
1. **Create a separate Vercel project for backend:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Configure environment variables in Vercel:**
   - Database connection string
   - JWT secret
   - Other sensitive data

## Option 2: Netlify + Railway

### Frontend (Netlify)
1. **Connect your GitHub repo to Netlify**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Add custom domain:**
   - Go to Site settings > Domain management
   - Add `blackphuquoc.com`

### Backend (Railway)
1. **Deploy backend to Railway:**
   - Connect your GitHub repo
   - Set environment variables
   - Deploy

## Option 3: Traditional VPS Deployment

### Server Setup
1. **Rent a VPS (DigitalOcean, AWS, etc.)**
2. **Install Node.js, PM2, Nginx**
3. **Clone your repository**

### Backend Setup
```bash
cd backend
npm install
npm run setup-db
pm2 start src/app.js --name "henhodi-backend"
```

### Frontend Setup
```bash
npm install
npm run build
```

### Nginx Configuration
Create `/etc/nginx/sites-available/blackphuquoc.com`:

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Frontend
    location / {
        root /var/www/blackphuquoc.com/build;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate
```bash
sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com
```

## Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://blackphuquoc.com/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=henhodi_db
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

## DNS Configuration

Configure your domain's DNS records:
- A record: Point to your server IP
- CNAME record: www → blackphuquoc.com

## Post-Deployment Checklist

- [ ] Test all routes work correctly
- [ ] Verify API endpoints are accessible
- [ ] Check SSL certificate is working
- [ ] Test user registration/login
- [ ] Verify image uploads work
- [ ] Check mobile responsiveness
- [ ] Test language switching
- [ ] Monitor error logs

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Backup Strategy

1. **Database backups:**
   ```bash
   mysqldump -u username -p database_name > backup.sql
   ```

2. **Code backups:**
   - Use Git for version control
   - Regular commits and pushes

## Troubleshooting

### Common Issues:
1. **CORS errors:** Check backend CORS configuration
2. **404 errors:** Verify Nginx configuration
3. **Database connection:** Check environment variables
4. **SSL issues:** Verify certificate installation

### Useful Commands:
```bash
# Check if services are running
sudo systemctl status nginx
pm2 status

# Restart services
sudo systemctl restart nginx
pm2 restart all

# Check ports
sudo netstat -tlnp
``` 