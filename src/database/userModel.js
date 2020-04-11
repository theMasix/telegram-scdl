const mongoose = require('./database');

const collectionName = 'user';
const userSchema = mongoose.Schema({
  // It's user_id or bot_id
  chat_id: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String
  },
  name: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  downloadedTracks: {
    // count of secceed track which delivered to user
    type: Number,
    default: 0
  },
  trackUrls: {
    // All the track which gave to bot
    type: Array,
    default: []
  }
});

// Add dates properly
// userSchema.pre('save', next => {
//   let now = Date.now();
//   console.log(this);

//   this.updatedAt = now;

//   if (!this.createdAt) {
//     this.createdAt = now;
//   }

//   next();
// });

const User = mongoose.model(collectionName, userSchema);
module.exports = User;
