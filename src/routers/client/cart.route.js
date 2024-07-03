const express = require('express')
const router = express.Router()
const cartController=require('../../controllers/client/cartController')

router.get('/',cartController.index)
router.get('/delete/:productId',cartController.delete)
router.get('/update/:productId/:quantity',cartController.update)
router.post('/add/:productId', cartController.addPost)

module.exports=router