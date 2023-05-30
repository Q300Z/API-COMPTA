const express = require("express");
const router = express.Router();
const facCtrl = require("../controllers/ctrlFac.js");
const multer = require("../middleware/multer-config");

router.get("/", facCtrl.getAllFac);
router.post("/", multer, facCtrl.createFac);
router.put("/:id", multer, facCtrl.modifyFac);
router.delete("/:id", facCtrl.deleteFac);

module.exports = router;
