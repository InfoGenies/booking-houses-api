const mongoose =  require("mongoose")

const municipalitySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
      type: String
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
      }
})
module.exports = mongoose.model('Municipality',municipalitySchema)