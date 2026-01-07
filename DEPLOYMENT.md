# Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free): https://vercel.com/signup
- Anthropic API key: https://console.anthropic.com/

### Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add API Key**
```bash
vercel env add ANTHROPIC_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
```

5. **Redeploy**
```bash
vercel --prod
```

You'll get a live URL like: `https://your-project.vercel.app`

### Alternative: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/consensus)

After deploying:
1. Go to Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY` with your API key

## Deploy to Netlify

### Steps

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy
```

4. **Configure API Key**
- Go to Site Settings → Environment Variables
- Add `ANTHROPIC_API_KEY`

5. **Deploy to Production**
```bash
netlify deploy --prod
```

## Deploy to Railway

### Steps

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Add Environment Variable**
```bash
railway variables set ANTHROPIC_API_KEY=your-key-here
```

5. **Deploy**
```bash
railway up
```

## Deploy to Render

1. Go to https://render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Set environment variables:
   - `ANTHROPIC_API_KEY`: your API key
5. Deploy

Build Command: `npm install && cd web && npm install && npm run build`
Start Command: `npm run server:ai`

## Environment Variables Required

For all deployments, you need:

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `AI_MAX_CONCURRENT` - Max concurrent API calls (optional, default: 10)
- `AI_TEMPERATURE` - AI temperature (optional, default: 0.7)
- `PORT` - Server port (usually auto-configured by hosting platform)

## Post-Deployment

After deployment, test your live site:

1. Visit your deployment URL
2. Enter a question: "Should we invest in renewable energy?"
3. Set participants to 5-10 for initial testing
4. Click "Submit to Parliament"
5. Watch the AI experts deliberate!

## Cost Monitoring

- Each expert consultation: ~$0.005-0.01
- 20 experts per deliberation: ~$0.10-0.20
- Monitor usage at: https://console.anthropic.com/

## Troubleshooting

### "ANTHROPIC_API_KEY not set"
- Ensure you added the environment variable in your hosting platform
- Redeploy after adding variables

### CORS errors
- The backend is configured with CORS enabled
- If issues persist, check hosting platform CORS settings

### API rate limits
- Reduce `maxParticipants` in the web interface
- Set `AI_MAX_CONCURRENT=5` to slow down requests

### High costs
- Default web interface uses 20 experts (reasonable)
- Consider adding usage limits or authentication
- Monitor Anthropic console for usage

## Security Notes

- **Never commit** your API key to git
- Use environment variables on hosting platforms
- Consider adding authentication for production use
- Monitor API usage regularly
- Set up billing alerts in Anthropic console
