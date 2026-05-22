# 🚀 StickRealm Deployment Guide

This guide covers deploying StickRealm to various hosting platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to Git
- [ ] `.env` file is NOT committed (it's in `.gitignore`)
- [ ] Environment variables are documented in `.env.example`
- [ ] `npm run build` works locally
- [ ] Game runs correctly with `npm run dev`

---

## 🎯 Render (Recommended for Beginners)

**Pros:** Free tier, easy setup, automatic deployments
**Cons:** Cold starts on free tier

### Step-by-Step

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/stickrealm.git
git push -u origin main
```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `stickrealm`

4. **Configure Service**
   - **Name:** `stickrealm` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables**
   - Click "Environment" tab
   - Add:
     - `NODE_ENV` = `production`
     - `PORT` = `3000` (optional, Render sets this automatically)
     - `MONGODB_URI` = Your MongoDB URI (optional)

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Your game will be live at `https://stickrealm.onrender.com`

### Auto-Deploy on Push

Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update game"
git push
```

---

## ⚡ Vercel (Best for Frontend)

**Pros:** Lightning fast, excellent DX, free tier
**Cons:** Serverless functions have limitations for WebSockets

### Step-by-Step

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

4. **Follow Prompts**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name? `stickrealm`
   - Directory? `./`
   - Override settings? `N`

5. **Set Environment Variables**
```bash
vercel env add NODE_ENV
# Enter: production

vercel env add MONGODB_URI
# Enter: your MongoDB URI (optional)
```

6. **Deploy to Production**
```bash
vercel --prod
```

Your game will be live at `https://stickrealm.vercel.app`

### Note on WebSockets

Vercel's serverless functions have a 10-second timeout. For production, consider:
- Using Render or Railway for the backend
- Deploying frontend to Vercel, backend elsewhere
- Using Vercel's Edge Functions (experimental)

---

## 🚂 Railway

**Pros:** Great for full-stack apps, generous free tier, WebSocket support
**Cons:** Requires credit card for free tier

### Step-by-Step

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `stickrealm`

3. **Configure**
   - Railway auto-detects Node.js
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add:
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = Your MongoDB URI (optional)

5. **Deploy**
   - Railway automatically deploys
   - Get your URL from the "Settings" tab

---

## 🟣 Heroku

**Pros:** Mature platform, lots of add-ons
**Cons:** No free tier anymore, more expensive

### Step-by-Step

1. **Install Heroku CLI**
```bash
# Windows
winget install Heroku.HerokuCLI

# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create stickrealm
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

---

## 🐳 Docker Deployment

For advanced users who want to containerize the app.

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t stickrealm .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  stickrealm
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
    restart: unless-stopped

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up -d
```

---

## 🗄️ MongoDB Setup

### MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose "Shared" (Free tier)
   - Select region closest to your server
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Save username and password

4. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your server's IP

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `stickrealm`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/stickrealm?retryWrites=true&w=majority
```

### Local MongoDB

1. **Install MongoDB**
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
```bash
# Mac/Linux
mongod --dbpath /path/to/data

# Windows (as service)
net start MongoDB
```

3. **Connection String**
```
mongodb://localhost:27017/stickrealm
```

---

## 🔧 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3000` | Server port |
| `MONGODB_URI` | No | - | MongoDB connection string (optional) |
| `JWT_SECRET` | No | - | JWT secret for auth (future feature) |

---

## 🧪 Testing Deployment

After deployment, test these features:

1. **Basic Connectivity**
   - Open the game URL
   - Check if login screen loads

2. **Game Functionality**
   - Create a character
   - Join a game
   - Move around
   - Attack
   - Use skills

3. **Multiplayer**
   - Open game in two browser tabs
   - Verify both players see each other
   - Test combat between players

4. **Performance**
   - Check for lag
   - Monitor frame rate
   - Test with multiple players

---

## 🐛 Common Deployment Issues

### Build Fails

**Error:** `Cannot find module 'typescript'`
```bash
# Solution: Ensure devDependencies are installed
npm install --include=dev
```

**Error:** `Vite build fails`
```bash
# Solution: Clear cache and rebuild
npm run clean
npm run build
```

### Server Won't Start

**Error:** `Port 3000 already in use`
```bash
# Solution: Change PORT in environment variables
PORT=8080 npm start
```

**Error:** `Cannot connect to MongoDB`
```bash
# Solution: Check MONGODB_URI or remove it to use in-memory mode
unset MONGODB_URI
npm start
```

### WebSocket Issues

**Error:** `WebSocket connection failed`
- Check if hosting platform supports WebSockets
- Verify CORS settings in `server.ts`
- Check firewall rules

### Performance Issues

**Slow loading:**
- Enable gzip compression
- Use CDN for static assets
- Optimize Three.js models

**High latency:**
- Choose server region close to users
- Reduce bot count
- Optimize game loop

---

## 📊 Monitoring

### Render

- View logs: Dashboard → Service → Logs
- Monitor metrics: Dashboard → Service → Metrics

### Vercel

- View logs: Dashboard → Project → Deployments → View Logs
- Monitor analytics: Dashboard → Project → Analytics

### Railway

- View logs: Project → Service → Logs
- Monitor metrics: Project → Service → Metrics

### Heroku

```bash
# View logs
heroku logs --tail

# Monitor metrics
heroku ps
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
            -H "Authorization: Bearer $RENDER_API_KEY"
```

---

## 🎉 Success!

Your StickRealm game is now live! Share the URL with friends and start battling!

For issues or questions, open an issue on GitHub.

---

**Happy Gaming! 🎮**
