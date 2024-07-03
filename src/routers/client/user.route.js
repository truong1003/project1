const express = require('express')
const router = express.Router()
const userController=require('../../controllers/client/userController')
const validate=require('../../validates/client/userValidate')
const authMiddleware=require('../../middlwares/client/authmiddleware')


router.get('/register',userController.register)
router.get('/login',userController.login)
router.get('/logout',userController.logout)
router.post('/login',validate.loginPost,userController.loginPost)
router.post('/register',validate.registerPost,userController.registerPost)
router.get('/password/forgot',userController.forgotPassword)
router.post('/password/forgot',validate.forgotPassword,userController.forgotPasswordPost)
router.get('/password/otp',userController.otpPassword)
router.post('/password/otp',userController.otpPasswordPost)
router.get('/password/reset',userController.resetPassword)
router.post('/password/reset',validate.resetPassword,userController.resetPasswordPost)
router.get('/info',authMiddleware.requireAuth,userController.info)




module.exports=router