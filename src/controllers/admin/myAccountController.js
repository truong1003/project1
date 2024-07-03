const Accounts= require("../../models/account")

class index {
    //[GET]/admin/my-account
    index(req,res){
        res.render("admin/pages/my-account/index.pug",{
            titlePage: "Thông tin cá nhân"
        })
    };

    //[GET]/admin/my-account/edit
    edit(req,res){
        res.render("admin/pages/my-account/edit.pug",{
            titlePage: "Chỉnh sửa thông tin cá nhân"
        })
    }

    //[PATCH]/admin/my-account/edit
    async editPacth(req,res){
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`
        }

        const emailExit = await Accounts.findOne({
            _id: {$ne:res.locals.user._id},
            email: req.body.email,
            deleted: false
        })

        if(emailExit){
            req.flash("error",`Email ${req.body.email} đã tồn tại`)
        }else{
            if(req.body.password){
            req.body.password=md5(req.body.password)
            }else{
                delete req.body.password
            }
            await Accounts.updateOne({_id:res.locals.user._id},req.body)

        }
        res.redirect("back")
    }
}
module.exports=new index