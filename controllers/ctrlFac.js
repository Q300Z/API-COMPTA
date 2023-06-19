const fs = require("fs");
const Fac = require("../db/models/modelFac.js");
const { default: mongoose } = require("mongoose");

exports.getAllFac = async (req, res, next) => {
  try {
    Fac.find()
      .then((el) => {
        res.status(200).json(el);
      })
      .catch((er) => {
        res.status(500).send("Erreur serveur " + er);
      });
  } catch (error) {
    console.error(error);
  }
};

exports.createFac = async (req, res, next) => {
  try {
    const newFac = JSON.parse(req.body.fac);
    //console.log(req.body);
    let preuve = null;
    if (req.file) {
      preuve = `/images/${req.file.filename}`;
    } else {
      preuve = "";
    }
    const id = new mongoose.Types.ObjectId();
    newFac["_id"] = id;
    newFac["preuve"] = preuve;
    const fac = new Fac({
      ...newFac,
    });
    fac
      .save()
      .then(() => {
        res.status(201).json({
          message: "Objet enregistré !",
          data: { _id: id, preuve: preuve },
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ error });
      });
  } catch (err) {
    res.status(400).send({ message: "Erreur d'ajout", data: err });
    console.log(err);
  }
};

exports.modifyFac = async (req, res, next) => {
  try {
    const fac = await Fac.findOne({ _id: req.params.id });
    if (!fac) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    let preuve = fac.preuve;
    console.log(req.file, preuve, req.body.fac);
    if (req.file && req.file.filename) {
      preuve = `/images/${req.file.filename}`;
      // Supprimer l'ancien fichier image si un nouveau fichier a été téléchargé
      if (fac.preuve) {
        const filename = fac.preuve.split("/").pop();
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }

    const updatedFac = req.file
      ? {
          ...JSON.parse(req.body.fac),
          preuve: preuve,
        }
      : { ...JSON.parse(req.body.fac) };

    Fac.updateOne({ _id: req.params.id }, updatedFac)
      .then(() => {
        return res
          .status(200)
          .json({ message: "Facture modifiée !", data: { preuve: preuve } });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: `Erreur lors de la modification de la facture : ${err}`,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Erreur lors de la modification de la facture : ${error}`,
    });
  }
};

exports.deleteFac = async (req, res, next) => {
  try {
    const fac = await Fac.findOne({ _id: req.params.id });
    if (!fac) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    const preuve = fac.preuve;
    if (preuve) {
      // Extract the image filename from the preuve URL
      const filename = preuve.split("/").pop();
      // Delete the image file from the server
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await Fac.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Suppression de la facture réussie" });
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la suppression de la facture: ${error}`,
    });
  }
};
