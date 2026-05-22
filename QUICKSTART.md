# ⚡ Quick Start Guide

Get StickRealm running in 2 minutes!

## 🎯 For Players

### Play Online
Just visit the deployed game URL and start playing! No installation needed.

### Controls
- **WASD** or **Arrow Keys** - Move
- **SPACE** - Attack
- **SHIFT** - Dash
- **Q** - Heavy Slash
- **E** - Guard
- **R** - Rage

## 💻 For Developers

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/stickrealm.git
cd stickrealm
npm install
```

### 2. Run
```bash
npm run dev
```

### 3. Play
Open `http://localhost:3000` in your browser!

## 🎮 Game Modes

- **⚔️ Deathmatch** - Free for all, first to 20 kills wins
- **🛡️ Team Battle** - Red vs Blue team warfare
- **💀 Survival** - Last one standing, no respawns
- **🎯 Practice** - Train against bots

## 🔧 Configuration

### No Database (Default)
Works out of the box! Just run `npm run dev`

### With MongoDB (Optional)
1. Copy `.env.example` to `.env`
2. Add your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/stickrealm
```
3. Run `npm run dev`

## 🚀 Deploy

### Render (Easiest)
1. Push to GitHub
2. Connect to Render
3. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

### Port already in use?
```bash
# Change port in .env
PORT=8080
```

### Build fails?
```bash
npm run clean
npm install
npm run build
```

### Game won't connect?
- Check if server is running on port 3000
- Clear browser cache
- Check browser console for errors

## 📚 Learn More

- [Full README](README.md) - Complete documentation
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [Contributing](CONTRIBUTING.md) - Help improve the game

## 🎉 That's It!

You're ready to battle! Have fun! 🎮
