# Deployment Guide - GitHub Pages

This guide will help you deploy your FireAuth app to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Your Firebase project configured

## Step 1: Update Vite Config

The `vite.config.js` is already configured with:
```javascript
base: '/auth-/'
```

**IMPORTANT**: Change `/auth-/` to match your GitHub repository name:
- If your repo is `https://github.com/username/my-auth-app`
- Change to: `base: '/my-auth-app/'`

## Step 2: Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `my-auth-app`)
3. Don't initialize with README (you already have files)

## Step 4: Connect to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to GitHub Pages

### Option A: Manual Deployment (Quick)

```bash
npm run deploy
```

This will:
1. Build your app (`npm run build`)
2. Deploy to GitHub Pages (`gh-pages -d dist`)

### Option B: Automatic Deployment with GitHub Actions (Recommended)

A GitHub Actions workflow is already set up in `.github/workflows/deploy.yml`.

**To enable it:**

1. Go to your GitHub repository
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push any changes to the `main` branch
5. The site will automatically deploy!

## Step 6: Configure Firebase for GitHub Pages

After deployment, your site will be at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Update Firebase Console:**

1. Go to Firebase Console → Authentication → Settings
2. Add your GitHub Pages URL to **Authorized domains**:
   - `YOUR_USERNAME.github.io`
3. For OAuth providers (Google, GitHub):
   - Update redirect URLs to include your GitHub Pages URL

## Step 7: Access Your Deployed Site

Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Troubleshooting

### Issue: Blank page after deployment
**Solution**: Make sure `base` in `vite.config.js` matches your repo name

### Issue: Firebase auth not working
**Solution**: Add your GitHub Pages domain to Firebase authorized domains

### Issue: 404 errors on refresh
**Solution**: GitHub Pages doesn't support client-side routing by default. The included `404.html` handles this.

## Updating Your Deployment

Whenever you make changes:

**Manual:**
```bash
git add .
git commit -m "Your changes"
git push
npm run deploy
```

**Automatic (with GitHub Actions):**
```bash
git add .
git commit -m "Your changes"
git push
```

The site will automatically rebuild and deploy!

## Environment Variables

If you need to hide your Firebase config:

1. Create `.env` file (already in `.gitignore`)
2. Move Firebase config to environment variables
3. Use GitHub Secrets for deployment
4. Update the GitHub Actions workflow to use secrets

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Update Firebase authorized domains

---

Need help? Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
