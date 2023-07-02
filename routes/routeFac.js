const express = require('express')
const router = express.Router()

const facCtrl = require('../controllers/ctrlFac.js')

const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.get('/', auth, facCtrl.getAllFac)
router.post('/', auth, multer, facCtrl.createFac)
router.put('/:id', auth, multer, facCtrl.modifyFac)
router.delete('/:id', auth, facCtrl.deleteFac)

module.exports = router
