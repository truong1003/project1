const Product = require('../../models/Product')
const Accounts = require('../../models/account')
const ProductCategory = require('../../models/Products-category')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require("../../config/system")
const createTreeHelper = require('../../helper/createTree')
const account = require('../../models/account')


class index {
    //[GET]/admin/products
    async index(req, res) {

        let find = {
            deleted: false
        }
        // Find Status //
        const filterStatus = filterStatusHelper(req.query)

        if (req.query.status) {
            find.status = req.query.status
        }

        // Find Search //
        const objectSearch = searchHelper(req.query)
        if (objectSearch.regax) { 
            find.title = objectSearch.regax
        }

        // Pagination Page //
        const countProducts = await Product.countDocuments(find)

        let objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 4,
            },
            req.query,
            countProducts
        )

        // Sort//
        let sort={}
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] =req.query.sortValue
        }else{
            sort.position='desc'
        }
        
        const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip)

        for (const product of products) {
            //Lấy ra thông tin người tạo
            const user= await Accounts.findOne({_id:product.createdBy.account_id})

            if(user){
                product.accountFullName=user.fullName
            }

            //Lấy ra thông tin người cập nhật gần nhất
            const updatedBy = product.updatedBy.slice(-1)[0]
            if(updatedBy){
                const userUpdated= await Accounts.findOne({
                    _id: updatedBy.account_id
                })
                updatedBy.accountFullName =userUpdated.fullName
            }

        }
        
        res.render('admin/pages/products/index', {
            titlePage: 'Danh sách sản phẩm',
            products: products,
            filterStatus: filterStatus,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        })
    };

    //[PATCH]/admin/products/change-status/:status/:id
    async changeStatus(req, res) {
        const status = req.params.status
        const id = req.params.id

        const updatedBy  ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({ _id: id }, { 
            status: status,
            $push : {updatedBy : updatedBy}
        })
        req.flash('success', 'Cập nhập trạng thái thành công')
        res.redirect('back')
    }

    //[PATCH]/admin/products/change-multi
    async changeMulti(req, res) {
        const type = req.body.type
        const ids = req.body.ids.split(",")

        const updatedBy  ={
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        switch (type) {
            case "active":
                await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push : {updatedBy : updatedBy} })
                req.flash('success', `Cập nhập trạng thái thành công ${ids.length} sản phẩm`)
                break;
            case "inactive":
                await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push : {updatedBy : updatedBy} })
                req.flash('success', `Cập nhập trạng thái thành công ${ids.length} sản phẩm`)
                break;
            case "deleted-all":
                await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                } })
                req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`)
                break;
            case "change-position":
                for (const item of ids) {
                    let [id, position] = item.split("-")
                    position = parseInt(position)
                    await Product.updateMany({ _id: { $in: id } }, { position: position, $push : {updatedBy : updatedBy} })
                }
                req.flash('success', `Đã thay đổi vị trí ${ids.length} sản phẩm`)
                break;
            default:
                break;
        }

        res.redirect('back')
    }

    //[DELETE]/admin/product/delete/:id
    async deteleItem(req, res) {
        const id = req.params.id

        await Product.updateOne({ _id: id }, {
            deleted: 'true',
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }) //(xóa mềm)
        //await Product.deleteOne({_id:id}) (xóa vĩnh viễn)
        req.flash('success', `Đã xóa thành công sản phẩm`)
        res.redirect('back')
    }

    //[GET]/admin/products/trash
    async trash(req, res) {
        let find = {
            deleted: 'true'
        }

        const objectSearch = searchHelper(req.query)
        if (objectSearch.regax) {
            find.title = objectSearch.regax
        }
        const countProducts = await Product.countDocuments(find)

        let objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 4,
            },
            req.query,
            countProducts
        )

        const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

        for (const product of products) {
            const user = await Accounts.findOne({_id:product.deletedBy.account_id})
            if(user){
                product.fullName=user.fullName
            }
        }

        res.render('admin/pages/products/trash', {
            titlePage: 'Danh sách sản phẩm',
            products: products,
            pagination: objectPagination
        })
    }

    //[PATCH]/admin/products/restore/:id
    async restoreItem(req, res) {
        const id = req.params.id

        await Product.updateOne({ _id: id }, {
            deleted: 'false',
        })
        req.flash('success', `Đã khôi phục thành công sản phẩm`)
        res.redirect('back')
    }

    //[DELETE]/admin/products/trash/deleted/:id
    async deteleTrashItem(req, res) {
        const id = req.params.id

        await Product.deleteOne({ _id: id })
        req.flash('success', `Đã xóa thành công sản phẩm`)
        res.redirect('back')
    }

    //[GET]/admin/products/create
    async create(req, res) {
        let find = {
            deleted: false
        }

        const category= await ProductCategory.find(find)
        const newCategory= createTreeHelper.tree(category)

        res.render("admin/pages/products/create", {
            titlePage: "Thêm mới sản phẩm",
            category: newCategory
        })
    }

    //[POST]/admin/products/create
    async createPost(req, res) {

        req.body.price = parseInt(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)
        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`
        // }

        if (req.body.position == "") {
            const countProduct = await Product.countDocuments()
            req.body.position = countProduct + 1
        } else {
            req.body.position = parseInt(req.body.position)
        }

        req.body.createdBy = {
            account_id: res.locals.user.id
        }

        const product = new Product(req.body)
        await product.save()

        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

    //[PATCH]//admin/products/trash/change-multi
    async restoreMulti(req, res) {
        const type = req.body.type
        const ids = req.body.ids.split(",")

        switch (type) {
            case "restore-all":
                await Product.updateMany({ _id: { $in: ids } }, { deleted: 'false' })
                req.flash('success', `Khôi phục sản phẩm thành công ${ids.length} sản phẩm`)
                break;
            case "deleted-all":
                await Product.deleteMany({ _id: { $in: ids } })
                req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`)
                break;
            default:
                break;
        }

        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

    //[GET]/admin/products/edit/:id
    async edit(req, res) {
        try {
            const find = {
                deleted: false,
                _id: req.params.id
            }
    
            const category= await ProductCategory.find({deleted: false})
            const newCategory= createTreeHelper.tree(category)

            const product = await Product.findOne(find)

            res.render("admin/pages/products/edit", {
                titlePage: "Chỉnh sửa sản phẩm",
                product: product,
                category : newCategory
            })
        } catch (error) {
            res.redirect(`${systemConfig.prefixAdmin}/products`)
        }
    }

    //[PATCH]/admin/products/edit/:id
    async editPatch(req, res) {
        req.body.price = parseInt(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        req.body.position = parseInt(req.body.position)

        try {

            const updatedBy  ={
                account_id: res.locals.user.id,
                updatedAt: new Date()
            }

            await Product.updateOne({ _id: req.params.id }, {
                ...req.body,
                $push : {updatedBy : updatedBy}
            })
            req.flash('success', `Đã chỉnh sửa thành công sản phẩm`)
        } catch (error) {
            req.flash('error', `Vui lòng nhập tiêu đề`)
        }
        res.redirect('back')
    }

    //[GET]/admin/products/detail/:id
    async detail(req,res){
        try {
            const find={
                deleted:false,
                _id:req.params.id
            }
            
            const product = await Product.findOne(find)

            res.render('admin/pages/products/detail',{
                titlePage : product.title,
                product : product
            })

        } catch (error) {
            res.redirect(`${systemConfig.prefixAdmin}/products`)
        }
    }
}


module.exports = new index