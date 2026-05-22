# ⚡ Quick Deploy Guide - 5 Minutes to Live!

Follow these exact steps to get your game online in 5 minutes.

---

## 🎯 Step 1: Push to GitHub (2 minutes)

### 1.1 Create Repository on GitHub

1. Open: https://github.com/new
2. Repository name: `stickrealm`
3. Make it **Public**
4. **DON'T** check any boxes (no README, no .gitignore, no license)
5. Click **"Create repository"**

### 1.2 Push Your Code

Copy your repository URL from GitHub (looks like):
```
https://github.com/YOUR_USERNAME/stickrealm.git
```

Then run these commands **one by one** in your terminal:

```bash
# 1. Add GitHub as remote (replace YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/stickrealm.git

# 2. Rename branch to main
git branch -M main

# 3. Push your code
git push -u origin main
```

**Enter your GitHub username and password (or token) when prompted.**

✅ **Done!** Refresh GitHub - your code should be there!

---

## ☁️ Step 2: Deploy to Vercel (3 minutes)

### 2.1 Sign Up / Login

1. Go to: https://vercel.com
2. Click **"Sign Up"** (or "Login" if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `stickrealm` repository
3. Click **"Import"**

### 2.3 Configure (IMPORTANT!)

**Framework Preset:** Other (or leave as detected)

**Build & Development Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Root Directory:** `./` (leave as is)

### 2.4 Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 2.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes (grab a coffee ☕)
3. Watch the build logs (optional but cool!)

### 2.6 Success! 🎉

When you see **"Congratulations!"** or the confetti animation:

1. Click **"Visit"** or **"Go to Dashboard"**
2. Copy your URL (looks like): `https://stickrealm-xxx.vercel.app`
3. Open it in your browser
4. **PLAY YOUR GAME!** 🎮

---

## 🎮 Step 3: Test Your Game

Open your Vercel URL and test:

1. ✅ Enter a username
2. ✅ Select a game mode
3. ✅ Click "ENTER ARENA"
4. ✅ Move around (WASD)
5. ✅ Attack (SPACE)
6. ✅ Use skills (SHIFT, Q, E, R)

### Test Multiplayer

1. Open your URL in a **new tab** or **different browser**
2. Join with a different username
3. You should see both players!
4. Try attacking each other

---

## 🔄 Making Updates

Whenever you change your code:

```bash
# 1. Save your changes in your code editor

# 2. Commit and push
git add .
git commit -m "Describe what you changed"
git push

# 3. Vercel automatically redeploys! (30-60 seconds)
```

That's it! No need to manually redeploy.

---

## 🐛 Something Wrong?

### "Server Offline" Error

**Fix:**
1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"**
4. Click the latest deployment
5. Check the **"Build Logs"** for errors
6. If you see errors, check the troubleshooting section below

### Build Failed

**Fix:**
```bash
# Test build locally first
npm run build

# If it works locally, try:
git add .
git commit -m "Fix build"
git push
```

### Can't Push to GitHub

**Fix:**
- GitHub now requires a **Personal Access Token**
- Go to: https://github.com/settings/tokens
- Generate new token (classic)
- Select "repo" scope
- Use the token as your password when pushing

---

## 📱 Share Your Game!

Your game is now live! Share it:

```
🎮 Check out my multiplayer stickman game!
🔗 https://your-url.vercel.app

Features:
✨ Real-time multiplayer
⚔️ 4 game modes
🤖 Smart AI bots
🎯 Skills & power-ups
```

---

## 🎯 What's Next?

- [ ] Add your live URL to README.md
- [ ] Share with friends
- [ ] Get feedback
- [ ] Make improvements
- [ ] Push updates (they auto-deploy!)

---

## 📞 Need Help?

**Check these files:**
- `DEPLOYMENT_GUIDE.md` - Detailed instructions
- `GITHUB_SETUP.md` - GitHub-specific help
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

**Still stuck?**
- Check Vercel docs: https://vercel.com/docs
- Check GitHub docs: https://docs.github.com

---

## ⏱️ Time Breakdown

- ✅ GitHub setup: 2 minutes
- ✅ Vercel deployment: 3 minutes
- ✅ Testing: 2 minutes
- **Total: ~7 minutes** (including testing!)

---

**🎉 You're done! Your game is live! Now go play and share it! 🎮**
