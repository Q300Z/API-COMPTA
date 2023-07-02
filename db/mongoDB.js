const mongoose = require('mongoose')

const db = 'API-FAC' // remplacer avec le nom de votre base de données
const uri = `mongodb://172.17.0.3:27017/${db}` || `mongodb://192.168.1.100:27017/${db}` // remplacer avec l'URI de votre base de données MongoDB

async function connectDB () {
  try {
    console.log(process.env.DB_URL)
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connexion à la base de données réussie')
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error)
  }
}

module.exports = connectDB
