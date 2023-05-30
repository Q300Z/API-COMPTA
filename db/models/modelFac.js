const mongoose = require("mongoose");

const facSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  titre: { type: String, required: true },
  prix: { type: String },
  date: { type: String, required: true },
  preuve: { type: String },
  categorie: { type: String },
});

module.exports = mongoose.model("Fac", facSchema);
