const express = require('express')
const router = express.Router()
const multer  = require('multer')
const storageMulter =require('../../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const settingsController=require('../../controllers/admin/settingsController')


router.get('/general', settingsController.general)
router.patch('/general',upload.single('logo'), settingsController.generalPatch)


module.exports=router