const md5 = require('md5');
const Accounts = require('../../models/account')
const Roles=require("../../models/roles.module")
const systemConfig = require("../../config/system")
const searchHelper = require('../../helper/search')
const filterStatusHelper = require('../../helper/filterStatus')

class index {
    //[GET]/accounts
    async home(req,res){
        let find = {
            deleted :false
        }

        const filterStatus = filterStatusHelper(req.query)
        if (req.query.status) {
            find.status = req.query.status
        }
        
        const objectSearch = searchHelper(req.query)
        if (objectSearch.regax) {
            find.fullName = objectSearch.regax
        }

        const records = await Accounts.find(find).select("-password -token")

        for (const record of records) {
            const role = await Roles.findOne({
                deleted : false,
                _id : record.role_id
            })
            record.role=role
        }

        res.render("admin/pages/accounts/index",{
            titlePage: 'Danh sách tài khoản',
            records : records,
            filterStatus: filterStatus
        })
    }

    //[GET]/accounts/create
    async create(req,res){

        const roles = await Roles.find({deleted : false})

        res.render("admin/pages/accounts/create",{
            titlePage: 'Tạo mới tài khoản',
            roles : roles
        })
    }

    //[POST]/accounts/create
    async createPost(req,res){
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`
        }

        const emailExit = await Accounts.findOne({
            email: req.body.email,
            deleted: false
        })

        if(emailExit){
            req.flash("error",`Email ${req.body.email} đã tồn tại`)
            res.redirect("back")
        }else{
            req.body.password=md5(req.body.password)

            const record = new Accounts(req.body)
            await record.save()
        }
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

    //[GET]/accounts/edit/:id
    async edit(req,res){
        let find = {
            _id : req.params.id,
            deleted: false
        }

        const data = await Accounts.findOne(find)
        const roles = await Roles.find({deleted: false})

        res.render("admin/pages/accounts/edit",{
            data: data,
            roles: roles
        })
    }

    //[PATCH]/accounts/edit/:id
    async editPatch(req,res){
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`
        }

        const emailExit = await Accounts.findOne({
            _id: {$ne: req.params.id},
            email: req.body.email,
            deleted: false
        })

        if(emailExit){
            req.flash("error",`Email ${req.body.email} đã tồn tại`)
        }else{
            if(req.body.password){
                req.body.password=md5(req.body.password)
            } else{
                delete req.body.password
            }
            await Accounts.updateOne({_id:req.params.id}, req.body)
        }

        res.redirect('/admin/accounts')
    }

    //[PATCH]/accounts/change-status/:status/:id
    async changeStatus(req,res){
        const id = req.params.id
        const status = req.params.status

        await Accounts.updateOne({_id:id},{status : status})

        res.redirect("back")
    }

    //[DELETE]/accounts/deleted/:id
    async deleteAccount(req,res){
        const id= req.params.id

        await Accounts.deleteOne({_id:id})

        res.redirect("back")
    }
    
    //[GET]/accounts/detail/:id
    async detail(req,res){
        const id = req.params.id

        const account = await Accounts.findOne({_id: id })

        const role = await Roles.findOne({_id : account.role_id})

        res.render("admin/pages/accounts/detail",{
            account : account,
            role : role
        })
    }
}


module.exports = new index