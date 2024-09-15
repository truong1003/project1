const express = require('express')
const router = express.Router()
const authController=require('../../controllers/admin/authController')
const validate = require("../../validates/admin/auth")

router.get('/login', authController.login)
router.post('/login',validate.loginPost, authController.loginPost)
router.get('/logout', authController.logout)




module.exports=router