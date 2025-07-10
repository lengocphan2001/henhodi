# 🌐 Test Your HTTPS Website

## 🎉 Great! SSL is Already Set Up

You're testing `https://blackphuquoc.com/` which means SSL is working. Let's verify everything is functioning correctly.

## 🔍 Test Your HTTPS Site

### Step 1: Test the Main Page
```bash
# Test HTTPS main page
curl -s https://blackphuquoc.com/ | head -20

# Test HTTP (should redirect to HTTPS)
curl -I http://blackphuquoc.com/
```

### Step 2: Test API Endpoints
```bash
# Test API health endpoint
curl -s https://blackphuquoc.com/api/health

# Expected response:
# {"status":"OK","message":"Henhodi API is running","timestamp":"..."}
```

### Step 3: Test Static Files
```bash
# Test if static files are accessible via HTTPS
curl -s https://blackphuquoc.com/static/js/main.f9586ddd.js | head -5
curl -s https://blackphuquoc.com/static/css/main.aabedf85.css | head -5
```

## 🌐 Browser Testing

### Open in Browser
1. **Open Chrome/Firefox/Safari**
2. **Go to** `https://blackphuquoc.com/`
3. **Check if the page loads** completely
4. **Look for the lock icon** in the address bar (SSL working)
5. **Open Developer Tools** (F12) and check:
   - **Console tab** for any JavaScript errors
   - **Network tab** for any failed requests
   - **Elements tab** to see the page structure

### What to Look For
- ✅ **Green lock icon** in address bar
- ✅ **Page loads without errors**
- ✅ **No console errors**
- ✅ **All static files load** (JS, CSS, images)
- ✅ **React app renders properly**

## 🔧 If You See Issues

### Issue 1: Mixed Content Warnings
If you see mixed content warnings, it means some resources are loading over HTTP instead of HTTPS.

**Fix:**
```bash
# Check your frontend environment variables
cat /var/www/blackphuquoc.com/henhodi/env.production

# Make sure API URL uses HTTPS
# REACT_APP_API_URL=https://blackphuquoc.com/api
```

### Issue 2: SSL Certificate Issues
```bash
# Check SSL certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run
```

### Issue 3: Redirect Issues
If HTTP doesn't redirect to HTTPS:

```bash
# Check Nginx SSL configuration
sudo cat /etc/nginx/sites-available/blackphuquoc.com

# Should have redirect from HTTP to HTTPS
```

## 📊 Monitor HTTPS Performance

### Check SSL Configuration
```bash
# Test SSL configuration
curl -I https://blackphuquoc.com/

# Check SSL certificate
openssl s_client -connect blackphuquoc.com:443 -servername blackphuquoc.com
```

### Monitor Logs
```bash
# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log | grep blackphuquoc.com

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## ✅ Success Indicators

Your HTTPS site is working correctly when:
- ✅ **HTTPS loads without warnings**
- ✅ **Green lock icon** in browser
- ✅ **HTTP redirects to HTTPS**
- ✅ **All resources load over HTTPS**
- ✅ **No mixed content warnings**
- ✅ **React app functions properly**
- ✅ **API calls work over HTTPS**

## 🚨 Common HTTPS Issues

### 1. Mixed Content
- **Problem:** Some resources load over HTTP
- **Solution:** Update all URLs to use HTTPS

### 2. SSL Certificate Expired
- **Problem:** Certificate is expired or invalid
- **Solution:** Renew certificate with `sudo certbot renew`

### 3. Redirect Loop
- **Problem:** Infinite redirects between HTTP and HTTPS
- **Solution:** Check Nginx configuration for proper redirect rules

## 📞 Next Steps

1. **Test in browser** and check for any issues
2. **Verify all functionality** works over HTTPS
3. **Check for mixed content warnings**
4. **Monitor SSL certificate expiration**

**Can you open `https://blackphuquoc.com/` in your browser and let me know:**
- Does the page load completely?
- Do you see any console errors?
- Does the React app function properly?
- Are there any mixed content warnings? 