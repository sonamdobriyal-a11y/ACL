# Update Vercel Environment Variable

## The Problem

Your deployed frontend on Vercel shows:
```
Cannot connect to backend server. Please start it first
```

This happens because Vercel doesn't know your backend URL yet.

---

## The Solution

You need to set the `REACT_APP_API_URL` environment variable on Vercel.

---

## Step-by-Step Fix

### Option 1: Via Vercel Dashboard (Easiest) ⭐

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your ACL Detection project

2. **Open Settings**
   - Click on your project
   - Click the **"Settings"** tab at the top

3. **Add Environment Variable**
   - In the left sidebar, click **"Environment Variables"**
   - Click **"Add New"**

4. **Configure Variable**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL (e.g., `https://acl-backend.onrender.com`)
   - **Environments**: Select all 3 checkboxes:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

5. **Redeploy**
   - Go to **"Deployments"** tab
   - Find the latest deployment
   - Click the **three dots (...)** menu
   - Click **"Redeploy"**
   - Check **"Use existing Build Cache"** (optional, makes it faster)
   - Click **"Redeploy"**

6. **Wait & Test**
   - Wait 2-3 minutes for deployment
   - Once status shows "Ready", visit your site
   - The backend connection error should be gone! ✅

---

### Option 2: Via Vercel CLI (Alternative)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Navigate to frontend
cd frontend

# Set environment variable
vercel env add REACT_APP_API_URL

# When prompted:
# - Enter your backend URL: https://your-backend.onrender.com
# - Select environments: Production, Preview, Development (use arrow keys + space)

# Redeploy
vercel --prod
```

---

## Common Issues & Solutions

### Issue 1: Still showing error after redeployment

**Cause**: Browser cached the old version

**Solution**:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or open in incognito/private window

### Issue 2: "ERR_NAME_NOT_RESOLVED" or "Failed to fetch"

**Cause**: Backend URL is wrong or backend is not deployed

**Solution**:
1. Check your backend URL is correct
2. Visit your backend URL directly: `https://your-backend.onrender.com/health`
3. Should show: `{"status":"healthy","mediapipe":"loaded"}`
4. If backend doesn't load, deploy backend first

### Issue 3: CORS error in browser console

**Cause**: Backend doesn't allow your frontend URL

**Solution** (on Render backend):
1. Go to Render dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Add/Update: `FRONTEND_URL` = `https://your-frontend.vercel.app`
5. Save (will auto-redeploy)

---

## Verify It's Working

After redeployment, your app should:
- ✅ Load without backend error message
- ✅ Camera detection works
- ✅ Image upload works
- ✅ Results display correctly

---

## Your Backend URL

### If Backend is on Render:
Format: `https://your-service-name.onrender.com`

### If Backend is on Railway:
Format: `https://your-app-name.up.railway.app`

### How to Find Your Backend URL:

**Render**:
1. Go to https://dashboard.render.com
2. Click your backend service
3. Copy the URL at the top (starts with `https://`)

**Railway**:
1. Go to https://railway.app/dashboard
2. Click your backend project
3. Click "Settings"
4. Copy the "Public URL"

---

## Quick Test

To test if your backend is working:

```bash
# Replace with your actual backend URL
curl https://your-backend.onrender.com/health
```

Should return:
```json
{"status":"healthy","mediapipe":"loaded","environment":"production"}
```

---

## Current Status Checklist

- [ ] Backend deployed and accessible
- [ ] Backend health check returns 200 OK
- [ ] Environment variable added on Vercel
- [ ] Frontend redeployed
- [ ] Browser cache cleared
- [ ] App tested and working

---

## Need Help?

If you're still stuck:

1. **Check Backend**: Visit `https://your-backend.onrender.com/health`
   - If this doesn't work, your backend isn't deployed properly

2. **Check Vercel Logs**:
   - Go to Deployments → Click latest → View Function Logs
   - Look for connection errors

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for network errors
   - Red errors will show the actual issue

---

## Next Steps

1. ✅ Add environment variable on Vercel
2. ✅ Redeploy
3. ✅ Test your app
4. 🎉 Share your live URL!

Your app should be fully functional after these steps!
