# 🚀 Deploy StickRealm to Render + Vercel

Since StickRealm uses Socket.io for real-time multiplayer, we need a **persistent server** (not serverless). Here's the best setup:

- **Render** → Backend (Socket.io server) - FREE
- **Vercel** → Frontend (Static files) - FREE

---

## 🎯 Step 1: Deploy Backend to Render (5 minutes)

### 1.1 Sign Up for Render

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

### 1.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your **stick-realm** repository
3. Click **"Connect"**

### 1.3 Configure the Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `stick-realm` (or any name you like) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | (leave empty) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 1.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### 1.5 Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for the build
3. You'll get a URL like: `https://stick-realm.onrender.com`
4. **COPY THIS URL!** You'll need it for Vercel

---

## 🌐 Step 2: Update Frontend for Render Backend

Now we need to tell the frontend where the backend is:

### 2.1 Add Environment Variable to Vercel

1. Go to: https://vercel.com/jessie081/stick-realm
2. Click **"Settings"** → **"Environment Variables"**
3. Add a new variable:
   - **Name:** `VITE_SERVER_URL`
   - **Value:** Your Render URL (e.g., `https://stick-realm.onrender.com`)
   - **Environment:** Production, Preview, Development (check all)
4. Click **"Save"**

### 2.2 Redeploy Vercel

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## ✅ Step 3: Test Your Game!

1. Open your Vercel URL: `https://stick-realm.vercel.app`
2. Enter a username
3. Click "ENTER ARENA"
4. **Play!** 🎮

### Test Multiplayer

1. Open the URL in another tab/browser
2. Join with a different username
3. You should see both players!

---

## 🐛 Troubleshooting

### "Server Offline" Error

**Check Render logs:**
1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. Look for errors

**Common issues:**
- Build failed → Check the build logs
- Server crashed → Check for runtime errors
- Port issues → Make sure PORT=10000 is set

### Can't Connect to Server

**Check CORS:**
The server already has CORS enabled for all origins, but if you have issues:

1. Go to Render dashboard
2. Add environment variable:
   - `ALLOWED_ORIGINS` = `https://stick-realm.vercel.app`

### Render Free Tier Limitations

⚠️ **Important:** Render's free tier:
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- 750 hours/month free (enough for testing)

**Solution for production:**
- Upgrade to Render's paid plan ($7/month)
- Or use Railway, Fly.io, or DigitalOcean

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| **Render** | Free | $0/month |
| **Vercel** | Hobby | $0/month |
| **Total** | | **$0/month** 🎉 |

**For production (no sleep):**
- Render Starter: $7/month
- Vercel Pro: $20/month (optional)

---

## 🔄 Future Updates

Whenever you push to GitHub:

1. **Render** auto-deploys the backend (3-5 min)
2. **Vercel** auto-deploys the frontend (1-2 min)

No manual work needed! 🎉

---

## 📊 Monitoring

### Render Dashboard
- View logs: https://dashboard.render.com
- Monitor uptime
- Check resource usage

### Vercel Dashboard
- View analytics: https://vercel.com/dashboard
- Monitor traffic
- Check build logs

---

## 🎯 Alternative: All-in-One Deployment

If you want everything on one platform:

### Option A: Railway
- Supports WebSockets
- Free tier: $5 credit/month
- Deploy: https://railway.app

### Option B: Fly.io
- Supports WebSockets
- Free tier: 3 VMs
- Deploy: https://fly.io

### Option C: DigitalOcean App Platform
- Supports WebSockets
- $5/month (no free tier)
- Deploy: https://www.digitalocean.com/products/app-platform

---

## 📝 Quick Commands

```bash
# Check Render deployment
curl https://stick-realm.onrender.com/api/health

# Check Vercel deployment
curl https://stick-realm.vercel.app

# View Render logs (if using CLI)
render logs -s stick-realm

# View Vercel logs
vercel logs
```

---

## 🎉 Success Checklist

- [ ] Render service created
- [ ] Backend deployed successfully
- [ ] Render URL copied
- [ ] VITE_SERVER_URL added to Vercel
- [ ] Vercel redeployed
- [ ] Game loads on Vercel URL
- [ ] Can join and play
- [ ] Multiplayer works (tested in 2 tabs)
- [ ] Bots spawn and work
- [ ] Skills work correctly

---

**🎮 Your game is now live and playable worldwide!**

**Backend:** https://stick-realm.onrender.com  
**Frontend:** https://stick-realm.vercel.app

Share it with friends and enjoy! 🌍
