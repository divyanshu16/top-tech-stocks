# Deployment Guide

Your production build is ready in the `dist/` folder! Here are several free options to deploy your tech stocks dashboard.

## 📦 What's Built

```
dist/
├── index.html                    # Main HTML file
└── assets/
    ├── index-C_gVj77w.css       # Compiled CSS (11.47 KB)
    └── index-CYH25h-F.js        # Compiled JavaScript (153.77 KB)
```

**Total Size**: ~165 KB (gzipped: ~53 KB)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Fastest deployment** - Takes 2 minutes!

1. Install Vercel CLI:
   ```bash
   bun install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Follow prompts (login, confirm settings)
4. Get your live URL instantly! (e.g., `https://top-tech-stocks.vercel.app`)

**Or use Vercel GitHub integration:**
- Push your code to GitHub
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repo
- Vercel auto-detects Vite and deploys!

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   bun install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. Get your live URL! (e.g., `https://top-tech-stocks.netlify.app`)

**Or drag-and-drop:**
- Go to [app.netlify.com/drop](https://app.netlify.com/drop)
- Drag the `dist` folder
- Instant deployment!

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   bun install -D gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/top-tech-stocks",
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   bun run build
   bun run deploy
   ```

4. Enable GitHub Pages in repo settings → Pages → Source: gh-pages branch

5. Visit: `https://YOUR_USERNAME.github.io/top-tech-stocks`

### Option 4: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo
3. Build settings:
   - Build command: `bun run build`
   - Output directory: `dist`
4. Deploy!

### Option 5: Surge.sh

1. Install Surge:
   ```bash
   bun install -g surge
   ```

2. Deploy:
   ```bash
   surge dist top-tech-stocks.surge.sh
   ```

3. Visit: `https://top-tech-stocks.surge.sh`

### Option 6: Render

1. Go to [render.com](https://render.com)
2. New → Static Site
3. Connect GitHub repo
4. Build command: `bun run build`
5. Publish directory: `dist`
6. Deploy!

## 🔧 Custom Domain

After deploying to any platform above, you can add a custom domain:

- **Vercel**: Project Settings → Domains → Add
- **Netlify**: Site Settings → Domain Management → Add custom domain
- **Cloudflare**: Pages → Custom Domains
- **GitHub Pages**: Repo Settings → Pages → Custom domain

## ⚙️ Environment Setup

All deployment platforms auto-detect:
- **Framework**: Vite
- **Build Command**: `bun run build` or `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+ (or Bun if supported)

## 📊 Deployment Checklist

Before deploying, verify:
- ✅ `bun run build` completes successfully
- ✅ `dist/` folder contains `index.html` and `assets/`
- ✅ All 57 unit tests pass (`bun test:run`)
- ✅ TradingView script is included in `index.html`
- ✅ No hardcoded localhost URLs

## 🌐 What You Get After Deployment

- ✅ Live, public URL accessible from anywhere
- ✅ HTTPS enabled automatically
- ✅ CDN for fast global loading
- ✅ Automatic deployments on git push (if connected)
- ✅ Free hosting (for personal projects)

## 🔄 Continuous Deployment

Once connected to GitHub, every push to main automatically:
1. Runs build
2. Deploys to production
3. Updates live site

**Recommended workflow:**
```bash
# Make changes
git add .
git commit -m "Update stock list"
git push

# Platform auto-deploys in ~2 minutes!
```

## 🚨 Troubleshooting

**Build fails on platform:**
- Ensure build command is: `npm run build` (most platforms don't support bun yet)
- Check Node version is 18+

**404 on routes:**
- This is a single-page app, no routing needed
- Just deploy the `dist` folder as-is

**Charts not loading:**
- Verify TradingView script is in `index.html`
- Check browser console for CORS errors
- TradingView widgets should work on any HTTPS domain

## 📱 Preview Before Deploy

Test the production build locally:
```bash
bun run preview
# Opens http://localhost:4173
```

## 🎯 Recommended: Vercel

For this project, **Vercel** is recommended because:
- ✅ One command deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ GitHub integration
- ✅ Free for personal use
- ✅ Zero configuration needed

**Quick deploy:**
```bash
vercel --prod
```

That's it! Your dashboard will be live at a public URL in seconds.
