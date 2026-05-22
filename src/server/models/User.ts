import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Authentication
  username: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 3,
    maxlength: 20,
    index: true
  },
  password: { 
    type: String, 
    required: false // Optional for device-based auth
  },
  deviceId: {
    type: String,
    unique: true,
    sparse: true, // Allow users without deviceId (legacy)
    index: true
  },

  // Progression & Lifetime Stats
  level: { type: Number, default: 1, min: 1 },
  xp: { type: Number, default: 0, min: 0 },
  kills: { type: Number, default: 0, min: 0 },
  deaths: { type: Number, default: 0, min: 0 },
  wins: { type: Number, default: 0, min: 0 },
  losses: { type: Number, default: 0, min: 0 },
  matchesPlayed: { type: Number, default: 0, min: 0 },

  // Cosmetics & Customization
  customization: {
    color: { type: String, default: '#3b82f6' },
    accessory: { type: String, default: 'none' },
    unlockedSkins: [{ type: String }] // Future expansion
  },

  // Preferences & Settings
  settings: {
    volume: { type: Number, default: 0.5, min: 0, max: 1 },
    sensitivity: { type: Number, default: 1.0, min: 0.1, max: 5.0 },
    showChat: { type: Boolean, default: true }
  },

  // Metadata
  lastLogin: { type: Date, default: Date.now },
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Virtual for K/D Ratio
userSchema.virtual('kdRatio').get(function() {
  return this.deaths === 0 ? this.kills : (this.kills / this.deaths).toFixed(2);
});

export const User = mongoose.model('User', userSchema);
