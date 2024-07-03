const md5 = require('md5');
const Accounts = require('../../models/account')
const systemConfig = require("../../config/system")


class index {
    //[GET]/auth/login
    async login(req,res){
        if(req.cookies.token){
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
        }else{
            res.render("admin/pages/auth/login",{
                titlePage: 'Trang đăng nhập'
            })
        }
    }

    //[POST]/auth/login
    async loginPost(req,res){
        const email=req.body.email
        const password=req.body.password

        const user = await Accounts.findOne({
            email : email,
            deleted : false
        })

        if(!user){
            req.flash("error","Email không tồn tại")
            res.redirect("back")
            return
        }   

        if(md5(password) != user.password){
            req.flash("error","Sai mật khẩu")
            res.redirect("back")
            return
        }

        if(user.status == "inactive"){
            req.flash("error","Tài khoản đã bị khóa")
            res.redirect("back")
            return
        }

        res.cookie("token", user.token)
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }

    //[GET]/auth/logout
    logout(req,res){
        res.clearCookie("token")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }
}

module.exports = new index