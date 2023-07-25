const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  stars: {
    type: Number
  },
  comment: {
    type: String
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);