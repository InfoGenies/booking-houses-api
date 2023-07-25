const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);