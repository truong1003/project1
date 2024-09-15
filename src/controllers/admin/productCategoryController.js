const ProductCategory = require('../../models/Products-category')
const Accounts = require('../../models/account')
const searchHelper = require('../../helper/search')
const createTreeHelper = require('../../helper/createTree')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require("../../config/system")
const filterStatusHelper = require('../../helper/filterStatus')

class index {
    //[GET]/admin/products-category
    async index(req, res) {
        let find = {
            deleted: false
        }

        const filterStatus = filterStatusHelper(req.query)

        if (req.query.status) {
            find.status = req.query.status
        }

        const objectSearch = searchHelper(req.query)
        if (objectSearch.regax) {
            find.title = objectSearch.regax
        }

        let sort={}
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] =req.query.sortValue
        }else{
            sort.position='desc'
        }

        const records= await ProductCategory.find(find).sort(sort)
        
        for (const record of records) {
            const user = await Accounts.findOne({_id : record.createdBy.account_id})

            if(user){
                record.fullName=user.fullName
            }

            const updatedBy = record.updatedBy.slice(-1)[0]
            if(updatedBy){
                const userUpdated= await Accounts.findOne({
                    _id: updatedBy.account_id
                })
                updatedBy.fullName =userUpdated.fullName
            }
        }

        const newRecords= createTreeHelper.tree(records)

        res.render('admin/pages/products-category/index',{
            titlePage:"Danh mục sản phẩm",
            records: newRecords,
            filterStatus: filterStatus
        })
    }
    //[GET]/admin/products-category/create
    async create(req,res){
        let find={
            deleted:false
        }

        const records = await ProductCategory.find(find)
        const newRecords= createTreeHelper.tree(records)

        res.render('admin/pages/products-category/create',{
            titlePage:"Tạo mới danh mục",
            records:newRecords
        })
    }

    //[POST]/admin/products-category/create
    async createPost(req,res){

        const permission = res.locals.role

        if(permission.permission.includes("products-category_create")){
            if (req.file) {
                req.body.thumbnail = `/uploads/${req.file.filename}`
            }
    
            if (req.body.position == "") {
                const count = await ProductCategory.countDocuments()
                req.body.position = count + 1
            } else {
                req.body.position = parseInt(req.body.position)
            }  
    
            req.body.createdBy = {
                account_id: res.locals.user.id
            }
    
            const productCategory = new ProductCategory(req.body)
            await productCategory.save()
            res.redirect(`${systemConfig.prefixAdmin}/products-category`)
        }else{
            console.log("that bai")
        }
    }

    //[GET]/admin/products-category/edit/:id
    async edit(req,res){
        const find ={
            deleted:false,
            _id :req.params.id
        }
        
        const data = await ProductCategory.findOne(find)
        const records = await ProductCategory.find({deleted:false})
        const newRecords= createTreeHelper.tree(records)

        res.render("admin/pages/products-category/edit",{
            pageTitile : "Chỉnh sửa danh mục",
            data : data,
            records:newRecords
        })
    }

    //[PATCH]/admin/products-category/edit/:id
    async eidtRecord(req,res){
        const find ={
            _id:req.params.id
        }

        req.body.position = parseInt(req.body.position)

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        if(req.body.parent_id){
            req.body.parent_id=req.body.parent_id
        }else{
            req.body.parent_id=""
        }

        req.body.position = parseInt(req.body.position)

        const updatedBy  ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await ProductCategory.updateOne(find,{
            ...req.body,
            $push: {updatedBy :updatedBy}
        })

        res.redirect("/admin/products-category/")
    }

    //[GET]/admin/products-category/trash
    async trash(req,res){
        const find={
            deleted:true
        }
        
        const products= await ProductCategory.find(find)

        for (const product of products) {
            const user = await Accounts.findOne({_id : product.deletedBy.account_id})

            if(user){
                product.fullNameDelete=user.fullName
            }
        }

        res.render("admin/pages/products-category/trash",{
            products:products
        })
    }

    //[DELETE]/admin/products-category/deleted/:id
    async deteleItem(req,res){
        const find={
            _id: req.params.id
        }

        await ProductCategory.updateOne(find,{
            deleted : true,
            deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }})

        res.redirect("back")
    }

    //[DELETE]/admin/products-category/trash/deleted/:id
    async deteleItemTrash(req,res){
        const find={
            _id: req.params.id
        }

        await ProductCategory.deleteOne(find)

        res.redirect("back")
    }

    //[PATCH]/admin/products-category/change-status/:status/:id
    async changeStatus(req,res){
        const status = req.params.status
        const id = req.params.id

        await ProductCategory.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Cập nhập trạng thái thành công')
        res.redirect('back')
    }

    //[GET]/admin/products-category/detail/:id
    async detail(req,res){
        const find={
            _id: req.params.id
        }

        const record = await ProductCategory.findOne(find)

        res.render("admin/pages/products-category/detail",{
            pageTitile : record.title,
            record : record
        })
    }

    //[PATCH]/admin/products-category/change-multi
    async changeMulti(req, res) {
        const type = req.body.type
        const ids = req.body.ids.split(",")

        switch (type) {
            case "active":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" })
                req.flash('success', `Cập nhập trạng thái thành công ${ids.length} sản phẩm`)
                break;
            case "inactive":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" })
                req.flash('success', `Cập nhập trạng thái thành công ${ids.length} sản phẩm`)
                break;
            case "deleted-all":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() })
                req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`)
                break;
            case "change-position":
                for (const item of ids) {
                    let [id, position] = item.split("-")
                    position = parseInt(position)
                    await ProductCategory.updateMany({ _id: { $in: id } }, { position: position })
                }
                req.flash('success', `Đã thay đổi vị trí ${ids.length} sản phẩm`)
                break;
            default:
                break;
        }
        res.redirect('back')
}
}

module.exports = new index