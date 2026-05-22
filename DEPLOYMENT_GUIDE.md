# 🚀 StickRealm Deployment Guide

This guide will walk you through deploying StickRealm to GitHub and Vercel.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ [Git](https://git-scm.com/) installed
- ✅ A [GitHub](https://github.com) account
- ✅ A [Vercel](https://vercel.com) account (free tier works great!)
- ✅ Node.js 18+ installed locally

---

## 🐙 Part 1: Deploy to GitHub

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create your first commit
git commit -m "Initial commit: StickRealm multiplayer game"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `stickrealm`
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/stickrealm.git

# Push your code
git branch -M main
git push -u origin main
```

**🎉 Your code is now on GitHub!**

---

## ☁️ Part 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Click "Import Git Repository"
   - Select your `stickrealm` repository
   - Click "Import"

4. **Configure your project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NODE_ENV=production
   PORT=3000
   ```
   
   *(Optional: Add MONGODB_URI if you want persistent data)*

6. **Click "Deploy"**

7. **Wait 2-3 minutes** for the build to complete

8. **🎉 Your game is live!** Vercel will give you a URL like:
   ```
   https://stickrealm.vercel.app
   ```

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? stickrealm
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### Set Environment Variables on Vercel

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `3000` | Server port (optional) |
| `MONGODB_URI` | *(optional)* | MongoDB connection string for persistent stats |

4. Click **Save**
5. **Redeploy** your project for changes to take effect

---

## 🎮 Testing Your Deployment

1. **Open your Vercel URL** (e.g., `https://stickrealm.vercel.app`)

2. **Test the game:**
   - Enter a username
   - Select a game mode
   - Click "ENTER ARENA"
   - Verify gameplay works smoothly

3. **Test multiplayer:**
   - Open the URL in multiple browser tabs/windows
   - Join with different usernames
   - Verify players can see and interact with each other

---

## 🐛 Troubleshooting

### Issue: "Server Offline" or Connection Errors

**Solution:**
- Check Vercel deployment logs: `vercel logs`
- Ensure environment variables are set correctly
- Verify the build completed successfully

### Issue: Socket.io Connection Failed

**Solution:**
- Vercel supports WebSockets, but check your `vercel.json` routes
- Ensure `/socket.io/(.*)` route points to `/server.ts`
- Try redeploying: `vercel --prod --force`

### Issue: Build Failed

**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint

# If successful locally, push to GitHub and redeploy
git add .
git commit -m "Fix build issues"
git push
```

### Issue: Game Lags or Slow Performance

**Solution:**
- Vercel's free tier has some limitations
- Consider upgrading to Vercel Pro for better performance
- Or deploy the backend separately to a service like:
  - [Render](https://render.com) (free tier available)
  - [Railway](https://railway.app)
  - [Fly.io](https://fly.io)

---

## 🔄 Updating Your Deployment

Whenever you make changes to your code:

```bash
# 1. Commit your changes
git add .
git commit -m "Description of your changes"

# 2. Push to GitHub
git push

# 3. Vercel will automatically redeploy! 🎉
```

Vercel automatically deploys every push to your `main` branch.

---

## 🌐 Custom Domain (Optional)

Want a custom domain like `stickrealm.com`?

1. **Buy a domain** from:
   - [Namecheap](https://www.namecheap.com)
   - [Google Domains](https://domains.google)
   - [Cloudflare](https://www.cloudflare.com)

2. **Add to Vercel:**
   - Go to your project → **Settings** → **Domains**
   - Click "Add Domain"
   - Enter your domain (e.g., `stickrealm.com`)
   - Follow Vercel's DNS configuration instructions

3. **Wait for DNS propagation** (5-30 minutes)

4. **🎉 Your game is now at your custom domain!**

---

## 📊 Monitoring & Analytics

### View Deployment Logs
```bash
vercel logs
```

### View Real-time Logs
```bash
vercel logs --follow
```

### Check Deployment Status
```bash
vercel ls
```

---

## 🎯 Performance Tips

1. **Enable Vercel Analytics:**
   - Go to your project → **Analytics**
   - Enable Web Analytics (free)

2. **Monitor Player Count:**
   - Add logging to track concurrent players
   - Use Vercel's serverless function metrics

3. **Optimize Assets:**
   - Images are already optimized
   - Three.js is tree-shaken by Vite

---

## 🆘 Need Help?

- **Vercel Documentation:** https://vercel.com/docs
- **GitHub Issues:** Create an issue in your repository
- **Vercel Support:** https://vercel.com/support

---

## 🎉 Success Checklist

- ✅ Code pushed to GitHub
- ✅ Vercel project created and deployed
- ✅ Environment variables configured
- ✅ Game loads and runs smoothly
- ✅ Multiplayer works across different browsers
- ✅ Skills and combat mechanics function correctly
- ✅ Bots spawn and behave properly

**Congratulations! Your game is now live and playable worldwide! 🌍🎮**

---

## 📝 Quick Reference Commands

```bash
# Git Commands
git add .
git commit -m "Your message"
git push

# Vercel Commands
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel logs              # View logs
vercel ls                # List deployments
vercel domains           # Manage domains
vercel env               # Manage environment variables

# Local Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check for errors
```

---

**Made with ❤️ for the StickRealm community**
