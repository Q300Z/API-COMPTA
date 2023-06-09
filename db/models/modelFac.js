const mongoose = require('mongoose')

const facSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  prix: { type: String },
  date: { type: String, required: true },
  preuve: { type: String },
  categorie: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId }
})

module.exports = mongoose.model('Fac', facSchema)
