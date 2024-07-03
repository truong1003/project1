const ProductCategory = require('../../models/Products-category')
const createTreeHelper = require('../../helper/createTree')

module.exports.category= async (req,res,next)=>{
    const productCategory= await ProductCategory.find({deleted : false})
    const newRroductCategory= createTreeHelper.tree(productCategory)
    res.locals.layoutProductsCategory=newRroductCategory
    next()
}