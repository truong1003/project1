const express = require('express')
const router = express.Router()
const searchController=require('../../controllers/client/searchController')

router.get('/', searchController.index)

module.exports=router