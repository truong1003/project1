const express = require('express')
const router = express.Router()
const chatController=require('../../controllers/client/chatController')

router.get('/',chatController.index)


module.exports=router