const express = require('express')
const connectDB = require('./db/mongoDB')
const rssRoute = require('./routes/routeFac')
const userRoutes = require('./routes/users')

const path = require('path')

const app = express()

const port = 3001
const host = process.env.API_URL || 'localhost'

try {
  const db = connectDB()
  db.then(() => {})
} catch (error) {
  console.error(error)
}
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use('/api/auth', userRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/factures', rssRoute)

app.listen(port, host, () => {
  console.log(`Serveur à l'écoute sur http://${host}:${port} `)
})
