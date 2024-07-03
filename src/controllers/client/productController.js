const Product=require('../../models/Product')
const ProductCategory=require('../../models/Products-category')
const helperProduct = require("../../helper/product")
const helperProductCategory = require("../../helper/productCategory")
class webController {
    //[GET]/products
    async index(req,res){
        const products=await Product.find({
            status: 'active',
            deleted: false
        }).sort({position :'desc'})
        
        const newProducts=helperProduct.priceNewProducts(products)

        res.render('client/pages/products/index',{
            titlePage: 'Danh sách sản phẩm',
            products: newProducts
        })
    }

    //[GET]/products/detail/:slugProduct
    async detail(req,res){
        try {
            const find={
                deleted: false,
                slug: req.params.slugProduct,
                status: "active"
            }
            
            const product = await Product.findOne(find)

            if(product.products_category_id){
                const category = await ProductCategory.findOne({
                    _id:product.products_category_id,
                    status: "active",
                    deleted: false
                })
                product.category =category
            }

            product.priceNew = helperProduct.priceNewProduct(product)

            res.render('client/pages/products/detail',{
                titlePage: product.title,
                product: product
            })

        } catch (error) {
            res.redirect(`/products`)
        }
    }

    //[GET]/product/:slugCategory
    async category(req,res){
        const productCategory = await ProductCategory.findOne({slug : req.params.slugCategory, deleted: false})

        const listSubCategory = await helperProductCategory.getSubCategory(productCategory.id)

        const listSubCategoryId = listSubCategory.map(item => item.id)

        const products = await Product.find({
            products_category_id: {$in :[productCategory.id,...listSubCategoryId]},
            deleted: false, 
            status: "active"}).sort({position: "desc"})
        const newProducts=helperProduct.priceNewProducts(products)

        res.render('client/pages/products/index',{
            titlePage: productCategory.title,
            products: newProducts
        })
    }
}

module.exports=new webController