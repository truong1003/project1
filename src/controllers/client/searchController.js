const Product=require("../../models/Product")
const helperProduct=require('../../helper/product')
class index{
    async index(req,res){

        let newProducts=[]
        const keyword = req.query.keyword

        if(keyword){
            const keyRegax = new RegExp(keyword,'i')

            const products = await Product.find({
                title : keyRegax,
                status : 'active',
                deleted : false
            })
            newProducts=helperProduct.priceNewProducts(products)
        }

        res.render('client/pages/search/index',{
            titlePage: 'Kết quả tìm kiếm',
            keyword:keyword,
            products:newProducts
        })
    }
}

module.exports = new index