# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages in 5 Minutes

### Step 1: Update Repository Name in Config

Open `vite.config.js` and change the `base` to your repository name:

```javascript
export default defineConfig({
  base: '/YOUR-REPO-NAME/',  // ⚠️ Change this!
  plugins: [react()],
})
```

Example: If your repo is `my-auth-app`, use `base: '/my-auth-app/'`

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `my-auth-app`)
3. **Don't** initialize with README

### Step 3: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy

**Option A - Manual Deploy (Quick):**
```bash
npm run deploy
```

**Option B - Automatic Deploy (Recommended):**

1. Go to your GitHub repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any changes to `main` branch
4. Site auto-deploys! ✨

### Step 5: Configure Firebase

Your site will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

**Add to Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `YOUR_USERNAME.github.io`

**For OAuth (Google/GitHub):**
- Update redirect URLs in provider settings
- Add your GitHub Pages URL

### Step 6: Test Your Site

Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🔧 Troubleshooting

### Blank Page?
- Check `base` in `vite.config.js` matches your repo name
- Make sure it starts and ends with `/`

### Firebase Auth Not Working?
- Add your domain to Firebase authorized domains
- Check Firebase config is correct

### 404 on Page Refresh?
- The `404.html` file handles this automatically
- Make sure it's in the `public` folder

---

## 📝 Update Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Update site"
git push
npm run deploy  # If using manual deploy
```

With GitHub Actions, just push and it auto-deploys!

---

## 🎨 Custom Domain (Optional)

1. Create `public/CNAME` file with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

3. Update Firebase authorized domains

---

## ✅ Checklist

- [ ] Updated `base` in `vite.config.js`
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Deployed site (`npm run deploy` or GitHub Actions)
- [ ] Added domain to Firebase authorized domains
- [ ] Tested authentication on live site

---

Need help? Check `DEPLOYMENT.md` for detailed instructions!
