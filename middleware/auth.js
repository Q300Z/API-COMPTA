const jwt = require('jsonwebtoken')
// Modèle utilisateur
const User = require('../db/models/users.js')

// Middleware d'authentification avec suivi des tokens
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(
      token,
      process.env.AUTH_KEY || 'RANDOM_TOKEN_SECRET'
    )
    const userId = decodedToken.userId

    // Vérification de la présence du token dans le tableau "tokens" de l'utilisateur
    User.findOneAndUpdate({ _id: userId })
      .then((user) => {
        const currentDate = new Date()
        if (!user || !user.tokens.find(t => t.token === token)) {
          throw new Error('Token invalide ou révoqué')
        }
        user.tokens = user.tokens.filter(
          (t) => t.expiresAt >= currentDate
        )
        req.auth = {
          userId
        }
        next()
      })
      .catch((error) => {
        res.status(401).json({ error })
      })
  } catch (error) {
    res.status(401).json({ error })
  }
}
