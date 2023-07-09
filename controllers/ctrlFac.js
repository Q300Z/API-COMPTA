const fs = require('fs')
const Fac = require('../db/models/modelFac.js')
const { default: mongoose } = require('mongoose')

/**
 * Récupère toutes les factures
 */
exports.getAllFac = async (req, res, next) => {
  try {
    Fac.find()
      .then((el) => {
        res.status(200).json(el)
      })
      .catch((er) => {
        res.status(500).send('Erreur serveur ' + er)
      })
  } catch (error) {
    console.error(error)
  }
}

/**
 * Crée une nouvelle facture
 */
exports.createFac = async (req, res, next) => {
  try {
    const newFac = JSON.parse(req.body.fac)
    let preuve = null

    if (req.file) {
      preuve = `/images/${req.file.filename}`
    } else {
      preuve = null
    }

    const id = new mongoose.Types.ObjectId()
    newFac._id = id
    newFac.preuve = preuve

    const fac = new Fac({
      ...newFac
    })

    fac
      .save()
      .then(() => {
        res.status(201).json({
          message: 'Objet enregistré !',
          data: newFac
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(400).json({ error })
      })
  } catch (err) {
    res.status(400).send({ message: "Erreur d'ajout", data: err })
    console.log(err)
  }
}

/**
 * Modifie une facture existante
 */
exports.modifyFac = async (req, res, next) => {
  try {
    const fac = await Fac.findOne({ _id: req.params.id })
    if (!fac) {
      return res.status(404).json({ message: 'Facture introuvable' })
    }

    let preuve = fac.preuve
    if (req.file && req.file.filename) {
      preuve = `/images/${req.file.filename}`
      if (fac.preuve) {
        const filename = fac.preuve.split('/').pop()
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
    }

    const updatedFac = req.file
      ? {
          ...JSON.parse(req.body.fac),
          preuve
        }
      : { ...JSON.parse(req.body.fac) }

    Fac.updateOne({ _id: req.params.id }, updatedFac)
      .then(() => {
        return res
          .status(200)
          .json({ message: 'Facture modifiée !', data: { preuve } })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json({
          message: `Erreur lors de la modification de la facture : ${err}`
        })
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: `Erreur lors de la modification de la facture : ${error}`
    })
  }
}

/**
 * Supprime une facture
 */
exports.deleteFac = async (req, res, next) => {
  try {
    const fac = await Fac.findOne({ _id: req.params.id })
    if (!fac) {
      return res.status(404).json({ message: 'Facture introuvable' })
    }

    const preuve = fac.preuve
    if (preuve) {
      const filename = preuve.split('/').pop()
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }

    await Fac.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: 'Suppression de la facture réussie' })
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la suppression de la facture: ${error}`
    })
  }
}
