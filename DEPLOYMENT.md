# MeetWorld Deployment Guide

## Backend Deployment (Render) ✅

Your backend is deployed on Render!

**Backend URL:** `https://maskchat-backend-XXXX.onrender.com`  
(Replace XXXX with your actual Render service URL)

## Frontend Deployment (Vercel)

### Quick Deploy Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard** (Recommended):
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import `JOSEPHYT7/MeetWorld` repository
   - Configure:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`
   - Add Environment Variable:
     - Name: `REACT_APP_BACKEND_URL`
     - Value: `https://your-render-backend-url.onrender.com`
   - Click "Deploy"

3. **Your frontend will be live at:**
   ```
   https://meet-world.vercel.app
   ```

## Environment Variables

### Frontend (Vercel):
- `REACT_APP_BACKEND_URL` - Your Render backend URL

### Backend (Render):
- `NODE_ENV=production` (already set)

## Testing Your Deployment

1. **Test Backend:**
   ```
   https://your-backend.onrender.com/health
   ```

2. **Test Frontend:**
   ```
   https://your-frontend.vercel.app
   ```

## Important Notes

- **Free Tier Render**: Backend sleeps after 15 min inactivity (~30s wake time)
- **Vercel**: Frontend is always fast and available
- **WebRTC**: Works automatically with P2P connections
- **Socket.IO**: Auto-configured to connect to your backend

## Troubleshooting

### Frontend can't connect to backend:
- Check REACT_APP_BACKEND_URL in Vercel environment variables
- Verify backend is running (visit /health endpoint)
- Check browser console for connection errors

### Backend shows offline:
- Free tier sleeps - first request wakes it up
- Check Render logs for errors
- Verify all dependencies are installed

## URLs Checklist

- [ ] Backend Health Check: https://your-backend.onrender.com/health
- [ ] Frontend URL: https://your-app.vercel.app
- [ ] Environment variable set in Vercel
- [ ] Socket.IO connecting successfully

