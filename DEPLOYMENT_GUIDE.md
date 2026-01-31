# ACL Detection System - Deployment Guide

## Overview
This guide covers deploying the ACL Detection System with a Python FastAPI backend and React frontend.

## Architecture
- **Backend**: Python FastAPI + MediaPipe (requires Python 3.11)
- **Frontend**: React SPA (Single Page Application)
- **Model**: MediaPipe Pose (downloads automatically on first run)

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) ⭐ RECOMMENDED
- **Pros**: Free tier, easy setup, automatic HTTPS, good performance
- **Best for**: Quick deployment, demos, production

### Option 2: Heroku (Full Stack)
- **Pros**: Simple deployment, manages both frontend and backend
- **Cons**: Paid service (no free tier anymore)

### Option 3: AWS/GCP/Azure
- **Pros**: Full control, scalable, professional
- **Cons**: More complex, requires cloud expertise

### Option 4: Docker + VPS (DigitalOcean, Linode)
- **Pros**: Full control, cost-effective
- **Cons**: Requires server management

---

## RECOMMENDED: Vercel + Railway Deployment

### Part 1: Backend Deployment on Railway

#### Prerequisites
- GitHub account
- Railway account (https://railway.app)

#### Steps:

1. **Prepare Backend for Deployment**

Create `backend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Update `backend/main.py` for Production**

Add environment-based CORS:
```python
import os

# Update CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if os.getenv("ENVIRONMENT") != "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Create `backend/Procfile`** (for some platforms):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

4. **Deploy to Railway**:
   - Push code to GitHub
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Select `backend` folder as root directory
   - Railway will auto-detect Python and deploy
   - Note your backend URL: `https://your-app.railway.app`

5. **Set Environment Variables on Railway**:
   ```
   ENVIRONMENT=production
   PORT=8000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### Part 2: Frontend Deployment on Vercel

#### Prerequisites
- Vercel account (https://vercel.com)
- GitHub account

#### Steps:

1. **Update API Endpoint in Frontend**

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

2. **Update API Calls in Frontend**

Modify `frontend/src/components/VideoCapture.js` and `ImageUpload.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Replace all http://localhost:8000 with ${API_URL}
const response = await axios.get(`${API_URL}/health`);
const response = await axios.post(`${API_URL}/detect-base64`, ...);
```

3. **Create `vercel.json`**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

4. **Deploy to Vercel**:
   - Push code to GitHub
   - Go to https://vercel.com
   - Click "New Project" → "Import Git Repository"
   - Select your repository
   - Set Root Directory to `frontend`
   - Framework Preset: Create React App
   - Add Environment Variable: `REACT_APP_API_URL=https://your-backend.railway.app`
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

---

## Alternative: Docker Deployment

### Docker Setup

1. **Create `backend/Dockerfile`**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgthread-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create models directory
RUN mkdir -p models

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Create `frontend/Dockerfile`**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create `frontend/nginx.conf`**:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **Create `docker-compose.yml` (root directory)**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - FRONTEND_URL=http://localhost:3000
    volumes:
      - ./backend/models:/app/models

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000
```

5. **Deploy**:
```bash
docker-compose up -d
```

---

## Preparation Steps (Before Deployment)

### 1. Update Environment Configuration

Create `backend/.env.example`:
```env
ENVIRONMENT=production
PORT=8000
FRONTEND_URL=https://your-frontend-url.com
```

### 2. Update Frontend for Production

Create helper file `frontend/src/config.js`:
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.railway.app' 
    : 'http://localhost:8000');
```

Use in components:
```javascript
import { API_URL } from '../config';
const response = await axios.get(`${API_URL}/health`);
```

### 3. Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates an optimized `build/` folder.

---

## Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend.com/health`
- [ ] Frontend loads correctly
- [ ] Camera detection works
- [ ] Image upload works
- [ ] Results display correctly
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Error logging enabled

---

## Production Considerations

### 1. Security
- Enable HTTPS (automatic on Vercel/Railway)
- Set proper CORS origins (don't use `["*"]` in production)
- Add rate limiting
- Sanitize user inputs

### 2. Performance
- Use CDN for static assets (automatic on Vercel)
- Compress images
- Enable caching
- Monitor API response times

### 3. Monitoring
- Set up error tracking (Sentry)
- Monitor uptime (UptimeRobot)
- Track analytics (Google Analytics)
- Log backend errors

### 4. Scaling
- Railway auto-scales
- Consider Redis for caching
- Use database for analytics (optional)

---

## Troubleshooting

### Issue: CORS Errors
**Solution**: Update backend CORS to include your frontend URL

### Issue: MediaPipe Model Not Loading
**Solution**: Ensure models directory has write permissions

### Issue: 502 Bad Gateway
**Solution**: Backend not running or wrong PORT configuration

### Issue: Slow Performance
**Solution**: 
- Reduce image quality in frontend
- Increase request interval
- Optimize MediaPipe settings

---

## Cost Estimates

### Free Tier Options:
- **Railway**: $5 credit/month (enough for hobby projects)
- **Vercel**: Unlimited for personal projects
- **Render**: 750 hours/month free

### Paid Options (if needed):
- **Railway**: ~$5-20/month
- **Heroku**: ~$7-25/month
- **AWS/GCP**: ~$10-50/month (varies by usage)
- **VPS**: ~$5-20/month

---

## Quick Start Commands

### Local Testing:
```bash
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend
cd frontend
npm start
```

### Production Build:
```bash
# Backend (no build needed)
pip install -r requirements.txt

# Frontend
cd frontend
npm run build
```

---

## Support & Maintenance

### Regular Updates:
1. Update dependencies monthly
2. Monitor for security vulnerabilities
3. Back up any analytics data
4. Test on different browsers

### Scaling Strategy:
1. Start with free tier
2. Monitor usage
3. Upgrade as needed
4. Consider CDN for global distribution

---

## Next Steps

1. Choose deployment platform (Vercel + Railway recommended)
2. Create accounts
3. Push code to GitHub
4. Follow deployment steps above
5. Configure environment variables
6. Test thoroughly
7. Share your deployed app!

---

## Need Help?

Common issues and solutions are in the Troubleshooting section. For platform-specific help:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Docker: https://docs.docker.com

Good luck with your deployment! 🚀
