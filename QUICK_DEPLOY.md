# Quick Deployment Guide - 15 Minutes

## 🚀 Fastest Way to Deploy (Recommended)

### Prerequisites (5 min)
1. GitHub account
2. Railway account (https://railway.app - sign up with GitHub)
3. Vercel account (https://vercel.com - sign up with GitHub)
4. Your code pushed to GitHub

---

## Step 1: Deploy Backend on Railway (5 min)

1. **Go to Railway**: https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your **ACL_cursor** repository
5. Railway will auto-detect the backend
6. **Add Environment Variables**:
   - Click on your project
   - Go to "Variables" tab
   - Add:
     ```
     ENVIRONMENT=production
     PORT=8000
     ```
7. Wait for deployment (2-3 minutes)
8. **Copy your backend URL** (e.g., `https://acl-backend.up.railway.app`)
9. **Test it**: Open `https://your-backend-url.railway.app/health` in browser
   - Should see: `{"status": "healthy", "mediapipe": "loaded"}`

✅ Backend is live!

---

## Step 2: Deploy Frontend on Vercel (5 min)

1. **Go to Vercel**: https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure Project**:
   - Framework Preset: **Create React App**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.railway.app` (from Step 1)
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Copy your frontend URL** (e.g., `https://acl-detection.vercel.app`)

✅ Frontend is live!

---

## Step 3: Update CORS (2 min)

1. **Go back to Railway**
2. Click on your backend project
3. Go to **"Variables"** tab
4. **Add new variable**:
   - Name: `FRONTEND_URL`
   - Value: `https://your-frontend-url.vercel.app` (from Step 2)
5. Railway will automatically redeploy

✅ CORS configured!

---

## Step 4: Test Everything (3 min)

Open your Vercel URL and test:

- [ ] Home page loads with images
- [ ] Click "Start Live Detection"
- [ ] Allow camera access
- [ ] See video feed with skeleton overlay
- [ ] Results panel updates with risk scores
- [ ] Try "Upload Image" page
- [ ] Upload a photo
- [ ] See detection results

### If Something Doesn't Work:

**CORS Error?**
- Make sure `FRONTEND_URL` on Railway matches your Vercel URL exactly
- Wait 1 minute for Railway to redeploy

**Backend Not Responding?**
- Check Railway logs: Project → Deployments → View Logs
- Verify `PORT=8000` environment variable is set

**Frontend Shows Old Backend URL?**
- Go to Vercel → Project → Settings → Environment Variables
- Update `REACT_APP_API_URL`
- Redeploy: Deployments → Three dots → Redeploy

---

## 🎉 You're Done!

Your app is now live and accessible worldwide!

### Share Your URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.railway.app

### Free Tier Limits:
- **Railway**: $5 credit/month (restarts monthly)
- **Vercel**: Unlimited for personal projects

### Next Steps:
- Add custom domain (optional)
- Set up monitoring
- Share with friends/colleagues!

---

## Troubleshooting Quick Fixes

### "Command failed" on Vercel
- **Fix**: Make sure you selected `frontend` as root directory
- **Rebuild**: Settings → General → Root Directory → Change to `frontend` → Save → Redeploy

### Railway deployment failing
- **Fix**: Check `requirements.txt` has all dependencies
- **Rebuild**: Project → Settings → Redeploy

### Camera not working
- **Fix**: Make sure you're using HTTPS (Vercel provides this automatically)
- **Note**: HTTP blocks camera access on modern browsers

### High Railway usage
- **Fix**: Add rate limiting or reduce request frequency
- **Upgrade**: Railway has paid plans starting at $5/month

---

## Alternative: One-Command Docker Deploy

If you prefer Docker:

```bash
# Build and run
docker-compose up -d

# Access locally
Frontend: http://localhost:80
Backend: http://localhost:8000
```

---

## Cost Calculator

### Free Tier (Good for 1000-5000 users/month):
- Railway: $5 credit/month
- Vercel: Unlimited (100GB bandwidth)
- **Total**: FREE

### If You Exceed Free Tier:
- Railway: ~$5-10/month
- Vercel: Stay free (or $20/month for pro features)
- **Total**: ~$5-30/month

---

## Support

**Stuck?** Check the detailed guide: `DEPLOYMENT_GUIDE.md`

**Common Issues**: `DEPLOYMENT_CHECKLIST.md`

**Need help?** 
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel

Good luck! 🚀
