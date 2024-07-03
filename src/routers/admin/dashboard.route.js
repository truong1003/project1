const express = require('express')
const router = express.Router()
const dashboardController=require('../../controllers/admin/dashboardController')

router.get('/', dashboardController.home)

module.exports=router