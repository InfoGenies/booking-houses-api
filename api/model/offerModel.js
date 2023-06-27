const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['PUBLISHED', 'WAITING_FOR_ACCEPTE', 'RENTED', 'DONE'],
    default: 'PUBLISHED'
  },
  price_per_day: { type: Number, default: 0.0, required: true },
  rated: { type: Boolean, default: false },
  start_date: { type: Date },
  end_date: { type: Date },
  created_at: { type: Date, default: Date.now }
});



module.exports =  mongoose.model('Offer', offerSchema)





