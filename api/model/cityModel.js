const mongoose =  require("mongoose")

const citySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
      type: String
    },
    picture: {
        type: String
      }
})

module.exports = mongoose.model('City',citySchema)