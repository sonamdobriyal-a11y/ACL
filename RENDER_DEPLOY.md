# Deploy Backend on Render - Step by Step

## Why Render?
- ✅ Free tier with 750 hours/month
- ✅ Automatic HTTPS
- ✅ Easy deployment from GitHub
- ✅ Auto-deploy on git push
- ✅ Built-in monitoring

---

## Prerequisites (2 minutes)

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at https://render.com (free, use GitHub to sign up)

---

## Step 1: Prepare Backend for Render (3 minutes)

### Files Already Created:
- ✅ `backend/render.yaml` - Render configuration
- ✅ `backend/Procfile` - Start command
- ✅ `backend/runtime.txt` - Python version
- ✅ `backend/requirements.txt` - Dependencies

### Verify requirements.txt:
Your `backend/requirements.txt` should have:
```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
opencv-python==4.8.1.78
mediapipe==0.10.32
numpy>=1.26.0
pillow>=10.1.0
python-jose[cryptography]==3.3.0
setuptools>=65.0.0
```

✅ All set!

---

## Step 2: Push Code to GitHub (2 minutes)

If not already done:

```bash
cd /Users/sonamdobriyal/Desktop/ACL_cursor
git init
git add .
git commit -m "Initial commit with Render config"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## Step 3: Deploy Backend on Render (5 minutes)

### 3.1 Create Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New +"** → Select **"Web Service"**

3. **Connect GitHub**:
   - Click "Connect account" if first time
   - Authorize Render to access your repositories
   - Select your ACL_cursor repository

4. **Configure the Web Service**:

   **Name**: `acl-detection-backend` (or your preferred name)
   
   **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   
   **Branch**: `main`
   
   **Root Directory**: `backend`
   
   **Runtime**: `Python 3`
   
   **Build Command**: 
   ```
   pip install -r requirements.txt
   ```
   
   **Start Command**: 
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   
   **Plan**: Select **"Free"** (0$/month, 750 hours)

5. **Advanced Settings** (Click to expand):
   
   **Environment Variables** - Add these:
   
   | Key | Value |
   |-----|-------|
   | `PYTHON_VERSION` | `3.11.7` |
   | `ENVIRONMENT` | `production` |
   | `FRONTEND_URL` | Leave empty for now (we'll add later) |
   
   **Health Check Path**: `/health`
   
   **Auto-Deploy**: `Yes` ✅

6. **Click "Create Web Service"**

---

## Step 4: Wait for Deployment (3-5 minutes)

Render will now:
1. ✅ Clone your repository
2. ✅ Install Python 3.11
3. ✅ Install dependencies from requirements.txt
4. ✅ Download MediaPipe model (first time only)
5. ✅ Start your FastAPI server

**Watch the logs** to see progress:
- You'll see: "Installing dependencies..."
- Then: "Starting server..."
- Finally: "Application startup complete"

---

## Step 5: Get Your Backend URL (1 minute)

Once deployed (green status):

1. **Copy your backend URL** from the top of the page
   - Format: `https://acl-detection-backend.onrender.com`
   - Or: `https://acl-detection-backend-abcd.onrender.com`

2. **Test it** - Open in browser:
   ```
   https://YOUR-BACKEND-URL.onrender.com/health
   ```
   
   Should see:
   ```json
   {
     "status": "healthy",
     "mediapipe": "loaded",
     "environment": "production"
   }
   ```

✅ **Backend is live!**

---

## Step 6: Deploy Frontend on Vercel (5 minutes)

### 6.1 Create Vercel Project

1. **Go to Vercel**: https://vercel.com/new

2. **Import your GitHub repository**

3. **Configure Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

4. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com` (from Step 5)

5. **Click "Deploy"**

6. Wait 2-3 minutes for deployment

7. **Copy your frontend URL**:
   - Format: `https://acl-detection.vercel.app`

✅ **Frontend is live!**

---

## Step 7: Update CORS on Render (2 minutes)

1. **Go back to Render Dashboard**

2. **Click on your backend service**

3. **Go to "Environment" tab**

4. **Add/Update Environment Variable**:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.vercel.app` (from Step 6)

5. **Click "Save Changes"**

6. Render will automatically redeploy (30-60 seconds)

✅ **CORS configured!**

---

## Step 8: Test Everything (3 minutes)

Open your Vercel URL and test:

### ✅ Checklist:
- [ ] Home page loads with images
- [ ] Navigation works (Home, Live Detection, Upload)
- [ ] Click "Start Live Detection"
- [ ] Allow camera access
- [ ] Video feed appears with skeleton overlay
- [ ] Results panel updates with knee angles and risk scores
- [ ] Try "Upload Image" page
- [ ] Upload a test photo
- [ ] See detection results with annotated image

---

## 🎉 Success! Your App is Live!

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Health**: `https://your-backend.onrender.com/health`
- **API Docs**: `https://your-backend.onrender.com/docs`

---

## Important Notes About Render Free Tier

### ⚠️ Spin Down Warning
**Free tier services spin down after 15 minutes of inactivity**

**What this means**:
- First request after idle = 30-50 seconds cold start
- Subsequent requests = fast (normal speed)

**Solutions**:
1. **Accept it** - Fine for demos and personal projects
2. **Keep-alive service** - Use UptimeRobot to ping every 10 minutes (free)
3. **Upgrade to paid** - $7/month for always-on service

### Free Tier Limits:
- ✅ 750 hours/month (enough for 24/7 if only one service)
- ✅ 100 GB bandwidth
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Spins down after 15 min inactivity

---

## Optional: Keep Backend Always Awake

### Option 1: UptimeRobot (Recommended, Free)

1. Go to https://uptimerobot.com
2. Sign up (free account)
3. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-backend.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
4. Save

This will ping your backend every 5 minutes, keeping it awake.

### Option 2: Cron Job (if you have a server)

```bash
# Add to crontab (crontab -e)
*/10 * * * * curl https://your-backend.onrender.com/health
```

### Option 3: Upgrade to Paid Plan
- **$7/month** for always-on service
- No cold starts
- More resources

---

## Monitoring Your Deployment

### Render Dashboard Features:

1. **Logs** - Real-time application logs
2. **Metrics** - CPU, Memory, Bandwidth usage
3. **Events** - Deployment history
4. **Shell** - SSH into your service (paid plans)

### Check Logs:
1. Go to your service in Render
2. Click "Logs" tab
3. See real-time output from your FastAPI server

### Common Log Messages:
```
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:10000
⚠️ Service is spinning down (after 15 min idle)
✅ Service starting up (on first request)
```

---

## Troubleshooting

### Issue: "Build Failed"

**Check**:
- `requirements.txt` is in `backend/` folder
- Python version is correct in `runtime.txt`
- All dependencies are available

**Solution**:
```bash
# Test locally first
cd backend
pip install -r requirements.txt
```

### Issue: "Service Unavailable" or 503 Error

**Causes**:
1. Service is spinning down (first request after idle)
2. Build failed
3. Start command is wrong

**Solution**:
- Wait 30-60 seconds for cold start
- Check logs in Render dashboard
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Issue: CORS Error in Browser

**Solution**:
1. Check `FRONTEND_URL` environment variable on Render
2. Should be: `https://your-frontend.vercel.app` (exact match)
3. Save and wait for redeploy

### Issue: MediaPipe Model Not Loading

**Solution**:
- First deployment takes longer (downloads model)
- Check logs for "Downloading pose_landmarker.task"
- Model is cached after first download

### Issue: High Memory Usage

**Solution**:
- Reduce `modelComplexity` in MediaPipe settings
- Upgrade to paid plan for more RAM

---

## Updating Your Deployment

### Automatic Updates (Recommended):
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Render auto-deploys (1-2 minutes)

### Manual Deploy:
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## Cost Comparison

### Free Tier (Current Setup):
- **Render Backend**: FREE (750 hours/month)
- **Vercel Frontend**: FREE (unlimited)
- **Total**: $0/month ✅

### If You Need Always-On:
- **Render Backend**: $7/month (Starter plan)
- **Vercel Frontend**: FREE
- **Total**: $7/month

### Alternative (All Free, but with cold starts):
- **Render Backend**: FREE (with cold starts)
- **Vercel Frontend**: FREE
- **UptimeRobot**: FREE (keeps backend warm)
- **Total**: $0/month ✅

---

## Performance Tips

### Reduce Cold Start Time:
1. Keep dependencies minimal
2. Use UptimeRobot to ping regularly
3. Upgrade to paid plan

### Optimize Response Time:
1. Reduce image quality in frontend (already set to 0.6)
2. Increase request interval (already set to 3 seconds)
3. Use CDN for static assets (Vercel does this automatically)

---

## Security Checklist

- [x] HTTPS enabled (automatic on Render)
- [x] CORS properly configured
- [x] Environment variables set
- [ ] Add rate limiting (optional)
- [ ] Set up monitoring alerts (optional)

---

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ CORS configured
4. ✅ Everything tested

### Optional Enhancements:
- [ ] Add custom domain
- [ ] Set up UptimeRobot for keep-alive
- [ ] Configure error tracking (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Set up CI/CD pipeline

---

## Support

### Render Support:
- **Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com

### Common Commands:
```bash
# View logs
# (Use Render dashboard → Logs tab)

# Restart service
# (Use Render dashboard → Manual Deploy → Restart)

# Check environment variables
# (Use Render dashboard → Environment tab)
```

---

## Congratulations! 🎉

Your ACL Detection System is now live and accessible worldwide!

**Share your app**:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`

**Important**: The first request after idle will take 30-50 seconds (cold start). This is normal for free tier. Use UptimeRobot to keep it warm, or upgrade to $7/month for always-on service.

Happy deploying! 🚀
