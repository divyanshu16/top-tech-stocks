# GitHub Pages Deployment Setup

Your project is ready to deploy to GitHub Pages! Follow these simple steps:

## 📋 One-Time Setup

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/divyanshu16/top-tech-stocks`

2. Click on **Settings** (top menu)

3. In the left sidebar, click **Pages**

4. Under **Source**, select:
   - Source: **GitHub Actions**

5. Click **Save**

That's it! The setup is complete.

## 🚀 Automatic Deployment

Your site will automatically deploy when you:
- Push to the `main` branch
- Push to the `claude/tech-stocks-dashboard-A1xcQ` branch
- Or manually trigger the workflow

## 📍 Your Live URL

After the first deployment completes (takes ~2-3 minutes), your site will be live at:

**`https://divyanshu16.github.io/top-tech-stocks/`**

## 🔄 How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Checks out your code
2. Sets up Bun
3. Installs dependencies with `bun install`
4. Builds the production site with `bun run build`
5. Deploys the `dist` folder to GitHub Pages

## 🎯 Triggering a Deployment

### Automatic (Recommended)
Just push your code:
```bash
git add .
git commit -m "Update dashboard"
git push
```

### Manual
1. Go to **Actions** tab in your GitHub repo
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Click **Run workflow** button

## 📊 Monitoring Deployments

1. Go to the **Actions** tab in your GitHub repo
2. You'll see all deployment runs
3. Click on any run to see:
   - Build logs
   - Deployment status
   - Errors (if any)

## ✅ Verifying Deployment

After pushing, check:

1. **Actions tab**: Workflow should be running (yellow dot)
2. Wait 2-3 minutes for it to complete (green checkmark)
3. Visit: `https://divyanshu16.github.io/top-tech-stocks/`

## 🔧 Troubleshooting

### Deployment Failed
- Check the **Actions** tab for error logs
- Most common issue: Make sure GitHub Pages is set to "GitHub Actions" (not "Deploy from branch")

### 404 Error
- Wait a few minutes after first deployment
- Clear browser cache
- Verify the URL is exactly: `https://divyanshu16.github.io/top-tech-stocks/`

### Changes Not Showing
- Check if the workflow ran successfully in Actions tab
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Wait ~1 minute for CDN to update

## 🎨 What You'll See

Once deployed, your live site will have:
- ✅ All 16 tech stocks with live TradingView charts
- ✅ Responsive grid layout
- ✅ Click cards to see detailed modals
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Mobile-friendly design

## 🔄 Updating Your Site

To update your live site:

1. Make changes locally
2. Test with: `bun run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
4. GitHub Actions automatically rebuilds and redeploys!

## 🌐 Custom Domain (Optional)

Want a custom domain like `stocks.yourdomain.com`?

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Add DNS records at your domain provider:
   - Type: `CNAME`
   - Name: `stocks` (or `www`)
   - Value: `divyanshu16.github.io`

## 📈 Site Analytics (Optional)

Track visitors by adding Google Analytics or Plausible to `index.html`.

## 🎉 Success!

Once deployed, share your dashboard:
- **Live URL**: `https://divyanshu16.github.io/top-tech-stocks/`
- **Repository**: `https://github.com/divyanshu16/top-tech-stocks`

Your tech stocks dashboard is now accessible to anyone on the internet! 🚀
