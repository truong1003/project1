const Products = require("../../models/Product")
const Cart=require("../../models/cart")
const helperProduct = require("../../helper/product")
class homeController {
    //[GET] /
    async home(req,res){
        //Sản phẩm nổi bật
        const productFeatured = await Products.find({featured :"1", deleted : false , status : "active"}).limit(6)

        const newProductsFeature=helperProduct.priceNewProducts(productFeatured)

        //Sản phẩm mới nhất
        const newProduct = await Products.find({deleted : false , status : "active"}).sort({position: "desc"}).limit(6)

        const newProductNew=helperProduct.priceNewProducts(newProduct)
        
        res.render('client/pages/home/index',{
            titlePage: 'Trang chủ',
            productFeatured: newProductsFeature,
            newProduct:newProductNew,
        })
    };
}

module.exports=new homeController