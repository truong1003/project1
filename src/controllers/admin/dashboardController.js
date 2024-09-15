const ProductsCategory=require('../../models/Products-category')
const Products=require('../../models/Product')
const Account=require('../../models/account')
const User=require('../../models/user')

class dashboardController {
    //[GET]/admin/dashboard
    async home(req,res){
        const statistic = {
            categoryProduct:{
                total:0,
                active:0,
                inactive:0
            }, 
            product:{
                total:0,
                active:0,
                inactive:0
            },
            account:{
                total:0,
                active:0,
                inactive:0
            },
            user:{
                total:0,
                active:0,
                inactive:0
            }
        }

        statistic.categoryProduct.total = await ProductsCategory.countDocuments({deleted:false})
        statistic.categoryProduct.active = await ProductsCategory.countDocuments({deleted:false,status: 'active'})
        statistic.categoryProduct.inactive = await ProductsCategory.countDocuments({deleted:false,status: 'inactive'})

        statistic.product.total= await Products.countDocuments({deleted:false})
        statistic.product.active= await Products.countDocuments({deleted:false,status:'active'})
        statistic.product.inactive= await Products.countDocuments({deleted:false,status:'inactive'})

        statistic.account.total= await Account.countDocuments({deleted:false})
        statistic.account.active= await Account.countDocuments({deleted:false,status:"active"})
        statistic.account.inactive= await Account.countDocuments({deleted:false,status:"inactive"})

        statistic.user.total= await User.countDocuments({deleted:false})
        statistic.user.active= await User.countDocuments({deleted:false,status:"active"})
        statistic.user.inactive= await User.countDocuments({deleted:false,status:"inactive"})

        res.render('admin/pages/dashboard/index',{
            titlePage: 'Trang tổng quan',
            statistic:statistic
        })
    };
}
module.exports=new dashboardController