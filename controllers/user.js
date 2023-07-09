const User = require('../db/models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/**
 * Crée un nouvel utilisateur dans la base de données
 */
exports.signup = (req, res, next) => {
  console.log(req.body)
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        tokens: [] // Initialisation du tableau de tokens à vide
      })
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

/**
 * Connecte un utilisateur en générant un token et en l'ajoutant au tableau de tokens de l'utilisateur
 */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' })
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' })
          }

          // Génération du token
          const token = jwt.sign({ userId: user._id }, process.env.AUTH_KEY || 'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h'
          })

          // Ajout du token et de sa date d'expiration dans le tableau `tokens`
          user.tokens.push({ token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
          user.save()

          res.status(200).json({
            userId: user._id,
            token
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

/**
 * Déconnecte un utilisateur en supprimant le token actuel de la liste des tokens de l'utilisateur
 */
exports.signout = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' })
      }

      // Récupérer le token actuel de l'en-tête de la requête
      const currentToken = req.headers.authorization.split(' ')[1]

      // Supprimer le token actuel de la liste des tokens de l'utilisateur
      user.tokens = user.tokens.filter((token) => token.token !== currentToken)

      // Sauvegarder les modifications
      user.save()
        .then(() => res.status(200).json({ message: 'Déconnexion réussie' }))
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}
