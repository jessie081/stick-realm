# 🐙 GitHub Setup Instructions

Your local git repository is ready! Follow these steps to push to GitHub:

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. **Repository name:** `stickrealm` (or your preferred name)
3. **Description:** "Real-time multiplayer stickman arena game with deathmatch, team battles, and survival modes"
4. **Visibility:** Public (or Private if you prefer)
5. **DO NOT** check any of these boxes:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (We already have these files!)

6. Click **"Create repository"**

## Step 2: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

### Option A: If you see the "Quick setup" page

Copy your repository URL (it looks like):
```
https://github.com/YOUR_USERNAME/stickrealm.git
```

Then run these commands in your terminal:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/stickrealm.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

### Option B: If you already have a repository

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/stickrealm.git

# Push
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that the README.md displays correctly

## 🎉 Success!

Your code is now on GitHub! You can:
- Share the repository with others
- Enable GitHub Pages (if desired)
- Set up GitHub Actions for CI/CD
- **Proceed to Vercel deployment** (see DEPLOYMENT_GUIDE.md)

---

## 🔐 Authentication Issues?

If you get authentication errors:

### Using HTTPS (Recommended for beginners)

GitHub now requires a **Personal Access Token** instead of password:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "StickRealm Deployment"
4. Select scopes: ✅ **repo** (full control)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. When pushing, use the token as your password

### Using SSH (For advanced users)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys
# Then use SSH URL instead:
git remote set-url origin git@github.com:YOUR_USERNAME/stickrealm.git
```

---

## 📝 Quick Reference

```bash
# Check remote
git remote -v

# Check status
git status

# View commit history
git log --oneline

# Make changes and push
git add .
git commit -m "Your message"
git push
```

---

## ⚡ Next Steps

Once your code is on GitHub:

1. ✅ **Deploy to Vercel** - See `DEPLOYMENT_GUIDE.md`
2. 📝 **Update README** - Add your live demo URL
3. 🌟 **Add topics** - On GitHub, add topics like: `game`, `multiplayer`, `socketio`, `threejs`
4. 📸 **Add screenshots** - Create a `screenshots` folder and add gameplay images
5. ⭐ **Star your own repo** - Why not? 😄

---

**Need help?** Check the full deployment guide: `DEPLOYMENT_GUIDE.md`
