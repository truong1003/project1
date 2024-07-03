const express = require('express')
const router = express.Router()
const myAccountController=require('../../controllers/admin/myAccountController')
const multer  = require('multer')
const storageMulter =require('../../helper/storageMulter')
const upload = multer({ storage: storageMulter() })


router.get('/', myAccountController.index)
router.get('/edit', myAccountController.edit)
router.patch('/edit',upload.single('avatar'),myAccountController.editPacth)


module.exports=router
