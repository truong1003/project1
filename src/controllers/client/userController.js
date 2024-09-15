const User=require('../../models/user')
const Cart=require('../../models/cart')
const ForgotPassword=require('../../models/forgot-password')
const helperPassword=require('../../helper/generate')
const md5 = require('md5');
const sendMailHelper=require('../../helper/sendMail')

class index{
    async register(req,res){

        res.render("client/pages/user/register",{
            titlePage:"Đăng kí tài khoản"
        })
    }

    async registerPost(req,res){
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        })

        if(existEmail){
            req.flash('error', 'Email đã tồn tại')
            res.redirect('back')
            return
        }

        req.body.password=md5(req.body.password)

        const user = new User(req.body)
        await user.save()

        res.cookie("tokenUser",user.tokenUser)

        res.redirect('/')
    }

    async login(req,res){
        res.render('client/pages/user/login',{
            titlePage:"Trang đăng nhập"
        })
    }

    async loginPost(req,res){
        const email=req.body.email
        const password=req.body.password

        const user= await User.findOne({
            email:email
        })

        if(!user){
            req.flash('error', 'Email không đúng')
            res.redirect('back')
            return
        }

        if(md5(password) != user.password){
            req.flash('error', 'Password không đúng')
            res.redirect('back')
            return
        }

        if(user.status=="inactive"){
            req.flash('error', 'Tài khoản đã bị khóa')
            res.redirect('back')
            return
        }

        res.cookie("tokenUser",user.tokenUser)

        await Cart.updateOne({_id:req.cookies.cartId},{user_id:user.id})

        res.redirect('/')
    }

    async logout(req,res){
        res.clearCookie("tokenUser")
        res.redirect(`/`)
    }

    async forgotPassword(req,res){
        res.render("client/pages/user/forgot-password",{
            titlePage:"Lấy lại mật khẩu"
        })
    }

    async forgotPasswordPost(req,res){
        const email =req.body.email
        const user = await User.findOne({email : email, deleted: false})

        
        if(!user){
            req.flash('error', 'Email không đúng')
            res.redirect('back')
            return
        }

        const otp=helperPassword.generateRandomNumber(6)
        const objectForgotPassword ={
            email:email,
            otp:otp,
            expireAt: Date.now() 
        }

        const forgotPassword= new ForgotPassword(objectForgotPassword)
        await forgotPassword.save()

        //Gửi OTP qua email
        const subject ="Mã OTP để xác minh lấy lại mật khẩu"
        const html=`
            Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời gian mã có hiệu lực là 3 phút
        `

        sendMailHelper.sendMail(email,subject,html)

        res.redirect(`/user/password/otp?email=${email}`)
    }

    async otpPassword(req,res){
        const email = req.query.email

        res.render("client/pages/user/otp-password",{
            titlePage:"Nhập mã OTP",
            email:email
        })
    }

    async otpPasswordPost(req,res){
        const email=req.body.email
        const otp = req.body.otp

        const result= await ForgotPassword.findOne({email:email,otp:otp})

        if(!result){
            req.flash('error', 'OTP không hợp lệ')
            res.redirect('back')
            return
        }

        const user = await User.findOne({email:email,deleted:false})

        res.cookie("tokenUser",user.tokenUser)
        res.redirect('/user/password/reset')
    }

    async resetPassword(req,res){
        res.render("client/pages/user/reset-password",{
            titlePage:"Đổi mật khẩu"
        })
    }

    async resetPasswordPost(req,res){
        const password = req.body.password
        const tokenUser = req.cookies.tokenUser

        await User.updateOne({tokenUser:tokenUser,deleted:false},{password : md5(password)})

        res.redirect('/')
    }

    async info(req,res){
        res.render('client/pages/user/info',{
            titlePage: "Thông tin tài khoản"
        })
    }
}

module.exports= new index