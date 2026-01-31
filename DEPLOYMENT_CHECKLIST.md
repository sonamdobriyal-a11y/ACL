# Deployment Checklist

## Pre-Deployment

### Backend
- [ ] Test backend locally: `cd backend && uvicorn main:app --reload`
- [ ] Verify all endpoints work: `/health`, `/detect-base64`
- [ ] Check `requirements.txt` is up to date
- [ ] Create `.env` file with production settings
- [ ] Test with production environment variables

### Frontend
- [ ] Test frontend locally: `cd frontend && npm start`
- [ ] Run build: `npm run build`
- [ ] Test production build: `npx serve -s build`
- [ ] Update API URL in `src/config.js`
- [ ] Verify all pages work (Home, Live Detection, Upload)

### Code Repository
- [ ] Push latest code to GitHub
- [ ] Ensure `.gitignore` excludes sensitive files
- [ ] Add README with setup instructions
- [ ] Tag release version (optional)

## Deployment Steps

### Step 1: Deploy Backend (Railway)
- [ ] Create Railway account
- [ ] Create new project from GitHub
- [ ] Select backend directory
- [ ] Add environment variables:
  - `ENVIRONMENT=production`
  - `PORT=8000`
  - `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://acl-backend.railway.app`)
- [ ] Test health endpoint: `https://your-backend.railway.app/health`

### Step 2: Deploy Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - `REACT_APP_API_URL=https://your-backend.railway.app`
- [ ] Deploy
- [ ] Copy frontend URL (e.g., `https://acl-detection.vercel.app`)
- [ ] Update Railway backend `FRONTEND_URL` with this URL

### Step 3: Update CORS
- [ ] Go back to Railway
- [ ] Update `FRONTEND_URL` environment variable with actual Vercel URL
- [ ] Redeploy backend if needed

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `GET https://your-backend.railway.app/health`
- [ ] Root endpoint: `GET https://your-backend.railway.app/`
- [ ] CORS headers present in response

### Frontend Tests
- [ ] Home page loads
- [ ] Navigation works (Home, Live Detection, Upload)
- [ ] Camera detection page:
  - [ ] Camera permission requested
  - [ ] Video feed appears
  - [ ] Skeleton overlay visible
  - [ ] Results panel updates
- [ ] Upload page:
  - [ ] Image upload works
  - [ ] Detection results display
  - [ ] Annotated image shows
- [ ] Mobile responsive
- [ ] All assets load (images, favicon)

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Monitoring Setup (Optional)

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Add analytics (Google Analytics)
- [ ] Set up logging

## Documentation

- [ ] Update README with live demo URL
- [ ] Document API endpoints
- [ ] Add deployment notes
- [ ] Include troubleshooting guide

## Security

- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] CORS properly configured
- [ ] No sensitive data in frontend code
- [ ] Environment variables set correctly
- [ ] API rate limiting (optional)

## Performance

- [ ] Frontend loads in < 3 seconds
- [ ] Backend responds in < 2 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score > 80

## Maintenance Plan

- [ ] Set calendar reminder for monthly updates
- [ ] Monitor Railway/Vercel usage
- [ ] Plan for scaling if needed
- [ ] Backup important data

## Success Criteria

✅ Backend is live and responding
✅ Frontend is accessible
✅ Camera detection works end-to-end
✅ Image upload works end-to-end
✅ No CORS errors
✅ Mobile responsive
✅ No console errors
✅ Performance is acceptable

## Rollback Plan

If deployment fails:
1. Revert to previous commit
2. Redeploy from working version
3. Check environment variables
4. Review logs on Railway/Vercel

## Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev

---

## Quick Commands Reference

### Local Development
```bash
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend
cd frontend
npm start
```

### Production Build Test
```bash
# Frontend
cd frontend
npm run build
npx serve -s build
```

### Check Deployment Status
```bash
# Test backend
curl https://your-backend.railway.app/health

# Test frontend
curl -I https://your-frontend.vercel.app
```

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Backend URL**: _______________
**Frontend URL**: _______________
