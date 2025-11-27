# Vercel Deployment Guide

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy from client directory**:
```bash
cd client
vercel
```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Deploy!

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

- `VITE_API_URL` - Your Express server URL (e.g., `https://your-api.vercel.app` or `https://your-ngrok-url.ngrok-free.app`)

Or use Vercel CLI:
```bash
vercel env add VITE_API_URL
```

## Configuration

The `vercel.json` file includes:
- ✅ SPA routing (all routes → index.html)
- ✅ Cache headers for static assets
- ✅ Build configuration for Vite
- ✅ Framework detection

## Important Notes

1. **API URL**: Make sure your Express server is accessible from the internet (use ngrok for local dev, or deploy Express server separately)

2. **CORS**: Ensure your Express server has CORS enabled for your Vercel domain

3. **Build**: Vercel will automatically run `npm run build` during deployment

4. **Preview Deployments**: Every push to your repo will create a preview deployment

## Troubleshooting

**Routes not working?**
- The `rewrites` in `vercel.json` should handle this. Make sure all routes redirect to `/index.html`

**API calls failing?**
- Check `VITE_API_URL` environment variable
- Verify CORS settings on Express server
- Check browser console for errors

**Build failing?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility
