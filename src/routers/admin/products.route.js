const express = require('express')
const multer  = require('multer')
const upload = multer()
const uploadCloud = require("../../middlwares/admin/uploadCloud")
const router = express.Router()
const productController=require('../../controllers/admin/productController')
const validate=require('../../validates/admin/validateProduct')


router.get('/', productController.index)

router.patch('/change-status/:status/:id', productController.changeStatus)

router.patch('/change-multi', productController.changeMulti)

router.delete('/delete/:id', productController.deteleItem)

router.get('/trash', productController.trash)

router.patch('/restore/:id', productController.restoreItem)

router.delete('/trash/deleted/:id', productController.deteleTrashItem)

router.get('/create', productController.create)

router.post('/create',upload.single('thumbnail'),uploadCloud.upload,validate.creatPost, productController.createPost)

router.patch('/trash/change-multi', productController.restoreMulti)

router.get('/edit/:id', productController.edit)

router.patch('/edit/:id',upload.single('thumbnail'),validate.creatPost, productController.editPatch)

router.get('/detail/:id', productController.detail)


module.exports=router




