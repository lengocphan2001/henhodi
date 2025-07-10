# Quick Deployment Guide for blackphuquoc.com

## 🚀 Fastest Way to Deploy (Vercel)

### Step 0: Verify Node.js Version
```bash
# Check your Node.js version
node -v
# Should show v22.16.0 or higher

# Check npm version
npm -v
# Should show 10.0.0 or higher
```

### Step 1: Prepare Your Code
```bash
# Make sure you're in the project root
cd /path/to/your/henhodi/project

# Install dependencies and build
npm install
npm run build
```

### Step 2: Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
vercel --prod
```

### Step 3: Deploy Backend to Vercel
```bash
# Go to backend directory
cd backend

# Deploy backend
vercel --prod

# Note the backend URL (e.g., https://henhodi-backend.vercel.app)
```

### Step 4: Connect Your Domain
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to Settings → Domains
4. Add `blackphuquoc.com`
5. Update your DNS records as instructed by Vercel

### Step 5: Update Environment Variables
In your Vercel frontend project settings:
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://henhodi-backend.vercel.app/api`)

In your Vercel backend project settings:
- `DB_HOST`: Your database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Your JWT secret

## 🌐 Alternative: Netlify + Railway

### Frontend (Netlify)
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add custom domain: `blackphuquoc.com`

### Backend (Railway)
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository (backend folder)
3. Set environment variables
4. Deploy

## 🐳 Docker Deployment (VPS)

If you have a VPS:

```bash
# Clone your repository
git clone <your-repo-url>
cd henhodi

# Make deployment script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh

# Deploy with Docker Compose
docker-compose up -d
```

## 📋 DNS Configuration

Configure your domain DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | Your server IP |
| CNAME | www | blackphuquoc.com |

## 🔧 Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://blackphuquoc.com/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_USER=henhodi_user
DB_PASSWORD=your_secure_password
DB_NAME=henhodi_db
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

## ✅ Post-Deployment Checklist

- [ ] Test website loads at blackphuquoc.com
- [ ] Verify API endpoints work
- [ ] Test user registration/login
- [ ] Check image uploads
- [ ] Test mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test language switching

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Check backend CORS settings
2. **404 errors**: Verify routing configuration
3. **Database connection**: Check environment variables
4. **SSL issues**: Ensure certificate is properly installed

### Support:
- Check the full `DEPLOYMENT.md` for detailed instructions
- Review Vercel/Netlify documentation
- Check server logs for errors

## 🎉 Success!

Once deployed, your website will be live at:
- **Frontend**: https://blackphuquoc.com
- **Backend API**: https://blackphuquoc.com/api (or your backend URL) 