const mongoose =  require("mongoose")

const pictureSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  picture: {
      type: String
    },
    isUrl: {
        type: Boolean , default : true
      }
})

module.exports = mongoose.model('Picture',pictureSchema)