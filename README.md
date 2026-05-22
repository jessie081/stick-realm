# 🎮 StickRealm

<div align="center">

![StickRealm Banner](https://img.shields.io/badge/StickRealm-Multiplayer%20Arena-orange?style=for-the-badge)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge)](https://nodejs.org)

**A real-time multiplayer stickman arena game with intense combat, team battles, and survival modes**

[Features](#-features) • [Quick Start](#-quick-start) • [Game Modes](#-game-modes) • [Controls](#-controls) • [Deployment](#-deployment)

</div>

---

## 🌟 Features

### 🎯 Core Gameplay
- **Real-time Multiplayer** - Powered by Socket.io for smooth, lag-free combat
- **4 Game Modes** - Deathmatch, Team Battle, Survival, and Practice
- **Advanced Combat System** - Melee attacks with directional hit detection
- **Skill System** - Dash, Heavy Slash, Guard, and Rage abilities
- **Power-ups** - Health packs, speed boosts, damage buffs, and shields
- **Leveling System** - Gain XP, level up, and increase your stats
- **Smart Bot AI** - Challenging AI opponents with difficulty settings

### 🎨 Graphics & UI
- **3D Graphics** - Built with Three.js for stunning visuals
- **Modern UI** - Sleek, responsive interface with Tailwind CSS
- **Smooth Animations** - Motion library for fluid transitions
- **Real-time HUD** - Health bars, cooldown timers, kill feed, and leaderboard
- **Character Customization** - Choose colors and accessories

### 🛠️ Technical Features
- **No Database Required** - Works out-of-the-box with in-memory storage
- **Optional MongoDB** - Add persistent stats when needed
- **TypeScript** - Fully typed for better development experience
- **Hot Module Replacement** - Fast development with Vite
- **Production Ready** - Easy deployment to Vercel, Render, or any Node.js host

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/stickrealm.git
cd stickrealm
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (optional)
```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env

# Edit .env if you want to use MongoDB or change the port
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

That's it! The game will run in **in-memory mode** by default - no database setup required.

### 🎮 First Time Playing?

1. Enter your **callsign** (username)
2. Choose your **skin color** and **gear** (accessories)
3. Select a **game mode**:
   - **Deathmatch** - Free-for-all, first to 20 kills wins
   - **Team Battle** - Red vs Blue team warfare
   - **Survival** - Last one standing, no respawns
   - **Practice** - Train with bots, no pressure
4. Toggle **Include Combat Bots** if you want AI opponents
5. Click **ENTER ARENA** and start playing!

### 🎯 Quick Controls Reference
- **WASD** or **Arrow Keys** - Move your stickman
- **SPACE** - Basic attack (1.2s cooldown)
- **SHIFT** - Dash forward (3s cooldown)
- **Q** - Heavy Slash (8s cooldown, high damage)
- **E** - Guard (12s cooldown, 80% damage reduction)
- **R** - Rage (25s cooldown, damage + speed boost)

---

## 🎮 Game Modes

### 🔫 Deathmatch
Free-for-all combat. First to 20 kills wins!
- Every player for themselves
- Respawn after death
- Power-ups scattered across the map

### 🛡️ Team Battle
Red vs Blue team warfare
- Work with your team to dominate
- Team scores tracked separately
- Strategic coordination is key

### 💀 Survival
Last one standing wins
- No respawns
- Play cautiously
- Winner takes all

### 🎯 Practice Mode
Hone your skills against bots
- Always includes AI opponents
- Perfect for learning mechanics
- No pressure, just fun

---

## 🎯 Controls

### Movement
- **W / ↑** - Move Up
- **S / ↓** - Move Down
- **A / ←** - Move Left
- **D / →** - Move Right

### Combat
- **SPACE** - Basic Attack (1.2s cooldown)
- **SHIFT** - Dash (3s cooldown) - Quick forward dash
- **Q** - Heavy Slash (8s cooldown) - Powerful area attack
- **E** - Guard (12s cooldown) - Reduce incoming damage by 80%
- **R** - Rage (25s cooldown) - Increase damage and speed

### Tips
- Attacks have a **60-degree cone** in front of you
- Combine movement with attacks for better positioning
- Use dash to close gaps or escape danger
- Guard when low on health
- Rage when you need to secure kills

---

## 🏗️ Project Structure

```
stickrealm/
├── src/
│   ├── components/
│   │   ├── Auth.tsx          # Login/character selection screen
│   │   ├── GameCanvas.tsx    # Main game canvas component
│   │   └── HUD.tsx           # Heads-up display
│   ├── game/
│   │   ├── GameClient.ts     # Client-side game logic
│   │   └── Renderer.ts       # Three.js rendering engine
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── server.ts                 # Express + Socket.io server
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## 🗄️ Database Setup (Optional)

StickRealm works **without a database** by default. However, you can enable MongoDB for persistent player stats:

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/stickrealm
```

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stickrealm
```

The server will automatically detect the MongoDB connection and use it if available, otherwise it falls back to in-memory mode.

---

## 🚀 Deployment

### Deploy to Render (Backend)

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=3000` (or leave default)
     - `MONGODB_URI=your-mongodb-uri` (optional)

4. **Deploy!** Render will automatically build and deploy your app

### Deploy to Vercel (Full-Stack)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables** in Vercel dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-uri` (optional)

### Deploy to Railway

1. **Create a new project** on [Railway](https://railway.app)
2. **Connect your GitHub repository**
3. **Add environment variables:**
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-uri` (optional)
4. **Deploy!**

### Deploy to Heroku

1. **Create a new app**
```bash
heroku create your-app-name
```

2. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
```

3. **Deploy**
```bash
git push heroku main
```

---

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```
- Hot module replacement enabled
- Server runs on port 3000
- Vite dev server integrated

### Build for Production
```bash
npm run build
```
- Compiles TypeScript
- Bundles frontend with Vite
- Outputs to `dist/` directory

### Type Checking
```bash
npm run lint
```

### Clean Build Files
```bash
npm run clean
```

---

## 🎨 Customization

### Change Game Settings

Edit `server.ts` to modify:
- **Map size:** `MAP_WIDTH` and `MAP_HEIGHT`
- **Game duration:** `MODE_DURATION`
- **Win conditions:** `WIN_KILLS`
- **Bot count:** Modify `botCount` in `startNewGame()`
- **Difficulty:** Change `difficulty` variable

### Modify Skills

Skill cooldowns and effects are in `server.ts`:
```typescript
case 'dash':
  player.cooldowns.dash = now + 3000; // 3s cooldown
  const dashDist = 150; // Distance
  // ...
```

### Customize Graphics

Edit `src/game/Renderer.ts` to change:
- Character models
- Environment (ground, rocks, trees)
- Lighting and shadows
- Particle effects

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Ensure Node.js version is 18+
- Run `npm install` again

### MongoDB connection issues
- Verify `MONGODB_URI` in `.env`
- Check if MongoDB service is running
- The game will work without MongoDB (in-memory mode)

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `npm run clean`
- Check TypeScript errors: `npm run lint`

### Game lag or performance issues
- Reduce bot count in `server.ts`
- Lower graphics quality in `Renderer.ts`
- Check network connection

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **Socket.io** - Real-time communication
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool

---

## 📧 Contact

Have questions or suggestions? Open an issue on GitHub!

---

<div align="center">

**Made with ❤️ by the StickRealm Team**

[⬆ Back to Top](#-stickrealm)

</div>
