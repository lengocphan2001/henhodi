# 🔧 Fix API Endpoint - Connect to Domain Instead of Localhost

## 🚨 Problem Identified

Your frontend is trying to connect to `http://localhost:5000` instead of `https://blackphuquoc.com/api` because:
- Missing or incorrect `.env` file
- Environment variables not set properly
- Frontend needs to be rebuilt with correct API URL

## 🔍 Check Current Configuration

### Step 1: Check if .env file exists
```bash
cd /var/www/blackphuquoc.com/henhodi
ls -la .env*
```

### Step 2: Check current environment files
```bash
# Check if .env exists
cat .env 2>/dev/null || echo ".env file not found"

# Check if env.production exists
cat env.production 2>/dev/null || echo "env.production file not found"
```

## 🛠️ Solution: Create Environment Files

### Step 1: Create .env file for development
```bash
cd /var/www/blackphuquoc.com/henhodi
nano .env
```

**Add this content:**
```env
REACT_APP_API_URL=https://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
```

### Step 2: Create env.production file
```bash
nano env.production
```

**Add this content:**
```env
REACT_APP_API_URL=https://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
```

### Step 3: Check your API service configuration
```bash
# Check the API service file
cat src/services/api.ts
```

**Make sure it uses the environment variable:**
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  baseURL: API_BASE_URL,
  // ... rest of your API configuration
};
```

## 🔄 Rebuild Frontend with New Environment

### Step 1: Clean and rebuild
```bash
# Remove old build
rm -rf build/

# Install dependencies (if needed)
npm install

# Build with new environment variables
npm run build
```

### Step 2: Verify the build
```bash
# Check if build was created
ls -la build/

# Check if static files exist
ls -la build/static/js/
ls -la build/static/css/
```

### Step 3: Test the updated site
```bash
# Test the main page
curl http://blackphuquoc.com

# Check if the API URL is correct in the built files
grep -r "blackphuquoc.com" build/ || echo "API URL not found in build"
```

## 🔍 Alternative: Check API Service Code

If the environment variables aren't working, let's check your API service:

### Step 1: View API service file
```bash
cat src/services/api.ts
```

### Step 2: Update API service if needed
```bash
nano src/services/api.ts
```

**Make sure it looks like this:**
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://blackphuquoc.com/api';

export const api = {
  baseURL: API_BASE_URL,
  // ... rest of your configuration
};
```

## 🌐 Test the Fix

### Step 1: Test in browser
1. **Open your browser** and go to `http://blackphuquoc.com`
2. **Open Developer Tools** (F12)
3. **Go to Network tab**
4. **Try to use the app** (login, register, etc.)
5. **Check if API calls go to** `https://blackphuquoc.com/api` instead of `localhost:5000`

### Step 2: Test API directly
```bash
# Test API endpoint
curl https://blackphuquoc.com/api/health

# Expected response:
# {"status":"OK","message":"Henhodi API is running","timestamp":"..."}
```

## 🚨 If Still Using Localhost

### Check for hardcoded URLs
```bash
# Search for localhost in your source code
grep -r "localhost" src/ --exclude-dir=node_modules

# Search for port 5000
grep -r "5000" src/ --exclude-dir=node_modules
```

### Update any hardcoded URLs
If you find hardcoded URLs, replace them with environment variables:

```typescript
// Instead of this:
const API_URL = 'http://localhost:5000';

// Use this:
const API_URL = process.env.REACT_APP_API_URL || 'https://blackphuquoc.com/api';
```

## ✅ Verification Steps

After fixing:

1. **Check environment files exist:**
   ```bash
   ls -la .env*
   ```

2. **Verify environment variables:**
   ```bash
   cat .env
   cat env.production
   ```

3. **Test API calls in browser:**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Use the app and check API requests

4. **Check for localhost references:**
   ```bash
   grep -r "localhost" build/ || echo "No localhost found in build"
   ```

## 📞 Next Steps

1. **Create the .env files** with the correct API URL
2. **Rebuild the frontend** with `npm run build`
3. **Test in browser** and check Network tab
4. **Verify API calls** go to the correct domain

**Try creating the .env files first, then rebuild and test!** 