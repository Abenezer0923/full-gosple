# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free)
- Render/Railway account (free)
- Cloudinary account (free)

## Step 1: Database Setup

### Option A: Render PostgreSQL
1. Go to https://render.com
2. Create new PostgreSQL database
3. Copy the External Database URL

### Option B: Neon.tech (Recommended)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

### Option C: Railway
1. Go to https://railway.app
2. Create new PostgreSQL database
3. Copy connection string

## Step 2: Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get your credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Backend Deployment (Render)

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `graceledger-api`
   - Root Directory: `server`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Instance Type: Free

5. Add Environment Variables:
```
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<generate-random-string>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

6. Deploy

## Step 4: Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. Add Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
```

5. Deploy

## Step 5: Database Migration & Seeding

After backend is deployed:

```bash
# Connect to your backend service
# Run migrations (should auto-run on deploy)
npx prisma migrate deploy

# Seed initial data
npm run seed
```

Or use Render Shell:
1. Go to your Render service
2. Click "Shell"
3. Run: `npm run seed`

## Step 6: GitHub Actions Setup

Add these secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add:
   - `RENDER_API_KEY` (from Render account settings)
   - `DATABASE_URL` (for testing)

## Step 7: Verify Deployment

1. Visit your Vercel URL
2. Login with: `admin@graceledger.com` / `admin123`
3. Check dashboard loads correctly

## Troubleshooting

### Backend Issues
- Check Render logs
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### Frontend Issues
- Check Vercel deployment logs
- Verify NEXT_PUBLIC_API_URL is correct
- Check browser console for errors

### Database Connection
- Ensure database is accessible from Render
- Check connection string format
- Verify SSL settings if required

## Alternative: Railway Deployment

### Backend on Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Add environment variables via dashboard

# Deploy
railway up
```

## Cost Estimates (Free Tier)

- Vercel: Free (100GB bandwidth/month)
- Render: Free (750 hours/month)
- PostgreSQL: Free (1GB storage)
- Cloudinary: Free (25GB storage, 25GB bandwidth)

## Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure rate limiting
- [ ] Review security headers
- [ ] Test all user roles

## Monitoring

### Render
- Built-in metrics and logs
- Set up email alerts

### Vercel
- Analytics dashboard
- Real-time logs

### Database
- Monitor connection pool
- Set up automated backups
- Check query performance

## Scaling

When you outgrow free tier:

1. Upgrade Render to paid plan ($7/month)
2. Upgrade database storage
3. Add Redis for caching
4. Implement CDN for static assets
5. Set up load balancing
