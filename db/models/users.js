const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: { type: String },
      expiresAt: { type: Date } // Champ pour la date d'expiration du token
    }
  ]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
