const mongoose =  require("mongoose")

const houseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
    houseType: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    rooms: {
      type: Number
    },
    bathrooms: {
      type: Number
    },
    kitchens: {
      type: Number
    },
    bedrooms: {
      type: Number
    },
    locationLatitude: {
      type: Number
    },
    locationLongitude: {
      type: Number
    },
    isAvailable: {
      type: Boolean
    },
    stars: {
      type: Number
    },
    numReviews: {
      type: Number
    },
    createdAt: {
      type: Date , default: Date.now , require : false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    municipality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality'
    },
    pictures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Picture'
      }
    ]
  });

  module.exports = mongoose.model('House',houseSchema)
