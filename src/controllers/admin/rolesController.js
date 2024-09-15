const Roles=require("../../models/roles.module")
const Accounts = require('../../models/account')
const systemConfig = require("../../config/system")
const searchHelper = require('../../helper/search')


class index {
    //[GET]/admin/roles
    async home(req,res){
        const find={
            deleted:false
        }

        const objectSearch = searchHelper(req.query)
        if (objectSearch.regax) {
            find.title = objectSearch.regax
        }

        const records = await Roles.find(find)

        for (const record of records) {
            const user = await Accounts.findOne({_id: record.createdBy.account_id})
            if(user){
                record.fullName = user.fullName
            }

            const updatedBy = record.updatedBy.slice(-1)[0]
            if(updatedBy){
                const userUpdated = await Accounts.findOne({_id:updatedBy.account_id})
                record.fullNameUpdate=userUpdated.fullName
            }
        }

        res.render("admin/pages/roles/index",{
            titlePage: "Nhóm quyền",
            records : records
        })
    }

    //[GET]/admin/roles/create
    async create(req,res){
        res.render("admin/pages/roles/create",{
            titlePage: "Tạo nhóm quyền",
        })
    }

    //[POST]/admin/roles/create
    async createPost(req,res){
        
        req.body.createdBy= {
            account_id : res.locals.user.id
        }

        const record = new Roles(req.body)
        await record.save()

        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

    //[GET]/admin/roles/edit/:id
    async edit(req,res){
        const find={
            deleted:false,
            _id:req.params.id
        }

        const data= await Roles.findOne(find)
        res.render("admin/pages/roles/edit",{
            titlePage: "Sửa nhóm quyền",
            data: data
        })
    }

    //[PATCH]/admin/roles/edit/:id
    async editRoles(req,res){
       
        const updatedBy  ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Roles.updateOne({_id:req.params.id},{
            ...req.body,
            $push : {updatedBy : updatedBy}
        })

        res.redirect("back")
    }

    //[GET]/admin/roles/permissions
    async permission(req,res){
        let find ={
            deleted : false
        }

        const records = await Roles.find(find)

        res.render("admin/pages/roles/permissions",{
            titlePage: "Phân quyền",
            records : records
        })
    }

    //[PATCH]/admin/roles/permissions
    async permissionPatch(req,res){
        const permission = JSON.parse(req.body.permissions)
        for (const item of permission) {
            await Roles.updateOne({_id: item.id},{permission:item.permission})
        }

        res.redirect("back")
    }

    //[DELETE]/admin/roles/deleted/:id
    async deleteRole(req,res){
        const id = req.params.id

        await Roles.updateOne({_id:id},{
            deleted : true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            } 
        })

        res.redirect("back")
    }

    //[GET]/admin/roles/detail/:id
    async detail(req,res){
        const id = req.params.id

        const role = await Roles.findOne({_id:id})

        res.render("admin/pages/roles/detail",{
            role : role
        })
    }

    //[GET]/admin/roles/trash
    async trash(req,res){
        const roles = await Roles.find({deleted : true})

        for (const role of roles) {
            const user = await Accounts.findOne({_id:role.deletedBy.account_id})

            if(user){
                role.fullName=user.fullName
            }

        res.render("admin/pages/roles/trash",{
            roles: roles
        })
    }

}}

module.exports= new index