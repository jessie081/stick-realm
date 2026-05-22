# 🚀 Deploy StickRealm to Render (All-in-One)

Deploy your entire game (frontend + backend) to Render in one place!

---

## ✅ **What You Already Did:**

If you already created the Render service, you're almost done! Just need to verify the settings.

---

## 🎯 **Render Configuration**

Make sure your Render service has these settings:

### **Basic Settings:**
- **Name:** `stick-realm` (or your choice)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance Type:** **Free**

### **Environment Variables:**
Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### **Advanced Settings:**
- **Health Check Path:** `/api/health`
- **Auto-Deploy:** ON (enabled)

---

## 🔄 **If You Need to Update Settings:**

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **stick-realm** service
3. Click **"Settings"** tab
4. Update any settings above
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## ✅ **Verify Deployment:**

Once Render shows "Live" status:

1. **Copy your Render URL** (e.g., `https://stick-realm-xxxx.onrender.com`)
2. **Open it in your browser**
3. You should see the game login screen!
4. **Enter a username and play!** 🎮

---

## 🎮 **Test Your Game:**

### Single Player Test:
1. Open your Render URL
2. Enter username
3. Select a game mode
4. Click "ENTER ARENA"
5. Move around (WASD)
6. Attack (SPACE)
7. Use skills (SHIFT, Q, E, R)

### Multiplayer Test:
1. Open your Render URL in **2 different tabs** (or browsers)
2. Join with different usernames
3. You should see both players!
4. Try attacking each other
5. Test all game modes

---

## 📊 **Monitor Your Game:**

### Render Dashboard:
- **Logs:** See real-time server logs
- **Metrics:** CPU, Memory usage
- **Events:** Deployment history

### Access Logs:
1. Go to: https://dashboard.render.com
2. Click your service
3. Click **"Logs"** tab
4. See live server activity!

---

## 🐛 **Troubleshooting:**

### Build Failed
**Check the logs:**
1. Go to Render dashboard
2. Click **"Events"** tab
3. Click the failed deployment
4. Read the error message

**Common fixes:**
```bash
# Test build locally first
npm run build

# If it works locally, push to GitHub
git add .
git commit -m "Fix build"
git push
```

### Server Crashed
**Check runtime logs:**
1. Go to **"Logs"** tab
2. Look for error messages
3. Common issues:
   - Port already in use (shouldn't happen on Render)
   - Missing dependencies (run `npm install`)
   - TypeScript errors (run `npm run lint`)

### Game Loads But Can't Connect
**Check Socket.io connection:**
1. Open browser console (F12)
2. Look for Socket.io errors
3. Make sure you're using `https://` not `http://`

### "Server Offline" Message
**Render free tier sleeps after 15 minutes:**
- First visit takes ~30 seconds to wake up
- This is normal for free tier
- Upgrade to paid plan ($7/month) to prevent sleep

---

## 💰 **Render Free Tier:**

✅ **What's Included:**
- 750 hours/month (enough for testing)
- Automatic HTTPS
- Auto-deploy from GitHub
- WebSocket support
- 512 MB RAM
- 0.1 CPU

⚠️ **Limitations:**
- Sleeps after 15 minutes of inactivity
- Takes ~30 seconds to wake up
- Shared resources (can be slow during peak times)

💎 **Upgrade to Starter ($7/month):**
- No sleep
- 512 MB RAM
- 0.5 CPU
- Better performance

---

## 🔄 **Making Updates:**

Whenever you change your code:

```bash
# 1. Make your changes in code editor

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Describe your changes"
git push

# 4. Render auto-deploys! (3-5 minutes)
```

---

## 🌐 **Custom Domain (Optional):**

Want `stickrealm.com` instead of `stick-realm-xxxx.onrender.com`?

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Go to Render → **Settings** → **Custom Domain**
3. Add your domain
4. Update DNS records (Render shows you how)
5. Wait for DNS propagation (5-30 minutes)
6. Done! 🎉

---

## 📱 **Share Your Game:**

Your game is now live! Share it:

```
🎮 Check out my multiplayer stickman game!
🔗 https://stick-realm-xxxx.onrender.com

Features:
✨ Real-time multiplayer
⚔️ 4 game modes (Deathmatch, Team Battle, Survival, Practice)
🤖 Smart AI bots
🎯 Skills & power-ups
💥 3D graphics with Three.js
```

**Social Media:**
- Twitter/X
- Reddit (r/gamedev, r/webdev)
- Discord servers
- Friends & family!

---

## 🎯 **Performance Tips:**

### For Better Performance:
1. **Upgrade to Starter plan** ($7/month) - No sleep, better resources
2. **Choose region closest to players** - Lower latency
3. **Monitor logs** - Catch errors early
4. **Test with multiple players** - Find bottlenecks

### Optimize Your Game:
1. **Reduce bot count** - Edit `server.ts`, change `botCount`
2. **Increase tick rate** - Change game loop interval
3. **Optimize graphics** - Reduce particles, shadows in `Renderer.ts`

---

## 📊 **Analytics (Optional):**

Want to track players?

### Add Google Analytics:
1. Get GA tracking ID
2. Add to `index.html`
3. Track page views, events

### Add Simple Analytics:
```typescript
// In server.ts, track connections
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  // Log to file or analytics service
});
```

---

## 🎉 **Success Checklist:**

- [ ] Render service created
- [ ] Build completed successfully
- [ ] Service shows "Live" status
- [ ] Game loads in browser
- [ ] Can join with username
- [ ] Can move and attack
- [ ] Skills work (Dash, Heavy Slash, Guard, Rage)
- [ ] Bots spawn and work
- [ ] Multiplayer works (tested in 2 tabs)
- [ ] All 4 game modes work
- [ ] Shared URL with friends

---

## 🆘 **Need Help?**

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**Your Game:**
- Check logs in Render dashboard
- Test locally first: `npm run dev`
- Check browser console (F12) for errors

---

## 🎊 **Congratulations!**

Your game is now:
- ✅ Live on the internet
- ✅ Playable by anyone worldwide
- ✅ Automatically deployed on every push
- ✅ Running on free hosting

**Now go share it and have fun!** 🎮🌍

---

**Your Game URL:** `https://stick-realm-xxxx.onrender.com`

**GitHub Repo:** `https://github.com/jessie081/stick-realm`

**Made with ❤️ - Enjoy your game!**
