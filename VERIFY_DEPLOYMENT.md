# ✅ Verify Your Deployment is Working

## 🎉 Good News!
Your frontend is now responding on port 3001! The HTML you received shows the React app is being served.

## 🔍 Let's Verify Everything is Working

### Step 1: Check PM2 Status
```bash
pm2 status
```

You should see both processes running:
- `henhodi-backend` (port 3000)
- `henhodi-frontend` (port 3001)

### Step 2: Test Backend API
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"OK","message":"Henhodi API is running","timestamp":"2025-07-10T..."}
```

### Step 3: Test Frontend Static Files
```bash
# Test if static files are loading
curl http://localhost:3001/static/js/bundle.js | head -5
```

### Step 4: Test Through Domain
```bash
# Test the full domain
curl http://blackphuquoc.com

# Test API through domain
curl http://blackphuquoc.com/api/health
```

## 🔧 Fix the "React App" Title Issue

The title showing "React App" suggests the build might not be complete. Let's fix this:

### Step 1: Check Build Directory
```bash
cd /var/www/blackphuquoc.com
ls -la build/
```

### Step 2: Rebuild Frontend
```bash
# Clean and rebuild
rm -rf build/
npm run build

# Check the build output
ls -la build/
```

### Step 3: Update Title in public/index.html
```bash
nano public/index.html
```

Change the title from:
```html
<title>React App</title>
```

To:
```html
<title>Henhodi - Black Phu Quoc</title>
```

### Step 4: Rebuild and Restart
```bash
# Rebuild
npm run build

# Restart PM2
pm2 restart henhodi-frontend

# Test again
curl http://localhost:3001
```

## 🌐 Test Your Website

Now test your actual website:

1. **Open your browser** and go to `http://blackphuquoc.com`
2. **Check if the page loads** completely
3. **Test the API** by going to `http://blackphuquoc.com/api/health`
4. **Check browser console** for any JavaScript errors

## 🚨 Common Issues to Check

### Issue 1: Static Files Not Loading
If you see a blank page or missing styles:

```bash
# Check if static files exist
ls -la /var/www/blackphuquoc.com/build/static/

# Check permissions
chmod -R 755 /var/www/blackphuquoc.com/build/
```

### Issue 2: API Not Working
If the frontend loads but API calls fail:

```bash
# Check backend logs
pm2 logs henhodi-backend

# Test backend directly
curl http://localhost:3000/api/health
```

### Issue 3: Environment Variables
Make sure your frontend knows where the API is:

```bash
# Check env.production file
cat /var/www/blackphuquoc.com/env.production

# Should contain:
# REACT_APP_API_URL=http://blackphuquoc.com/api
```

## ✅ Success Checklist

- [ ] PM2 shows both processes running
- [ ] `curl http://localhost:3000/api/health` returns JSON
- [ ] `curl http://localhost:3001` returns HTML
- [ ] `curl http://blackphuquoc.com` loads the website
- [ ] Website title shows correctly (not "React App")
- [ ] No JavaScript errors in browser console
- [ ] API calls work from the frontend

## 🔄 If Something's Still Wrong

### Check Logs
```bash
# PM2 logs
pm2 logs --lines 20

# Nginx logs
sudo tail -20 /var/log/nginx/error.log
sudo tail -20 /var/log/nginx/access.log
```

### Restart Everything
```bash
# Complete restart
pm2 restart all
sudo systemctl reload nginx
```

## 📞 Next Steps

If everything is working:
1. **Set up SSL certificate** (if not already done):
   ```bash
   sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com
   ```

2. **Test HTTPS**: Visit `https://blackphuquoc.com`

3. **Monitor your site**: Set up basic monitoring

If something is still not working, please share:
- The output of `pm2 status`
- The output of `curl http://blackphuquoc.com/api/health`
- Any error messages from the browser console
- The contents of your `env.production` file 