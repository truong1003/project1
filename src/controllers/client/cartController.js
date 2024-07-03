const Cart=require("../../models/cart")
const Products=require("../../models/Product")
const helperProduct=require("../../helper/product")
class index{

    //[GET]/cart
    async index(req,res){
        const cartId = req.cookies.cartId

        const cart = await Cart.findOne({_id :cartId})

        if(cart.products.length >0){
            for(const item of cart.products){
                const product_id = item.product_id

                const productInfo = await Products.findOne({_id:product_id})

                productInfo.priceNew=helperProduct.priceNewProduct(productInfo)

                item.productInfo=productInfo

                item.totalPrice=item.quantity*productInfo.priceNew
            }
        }

        cart.totalPrice=cart.products.reduce((sum,item) => sum+item.totalPrice ,0)

        res.render("client/pages/cart/index",{
            titlePage: "Trang giỏ hàng",
            cartDetail :cart 
        })
    }

    //[POST]/add/:productId
    async addPost(req,res){
        const cartId = req.cookies.cartId
        const productId = req.params.productId
        const quantity = parseInt(req.body.quantity)

        const cart = await Cart.findOne({_id:cartId})

        const exitsProductInCart = cart.products.find(item => item.product_id == productId)
        if(exitsProductInCart){
            const newQuantity =quantity + exitsProductInCart.quantity

            await Cart.updateOne(
            {
                _id:cartId,
                'products.product_id':productId
            },
            {
                'products.$.quantity':newQuantity
            }
        )
        }else{
            const objectCart={
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id:cartId
            },
            {
                $push : {products:objectCart}
            }
        )
        }

        req.flash("success","Them thanh cong")
        res.redirect('back')
    }

    //[GET]/cart/delete/:productId
    async delete(req,res){
        const cartId = req.cookies.cartId
        const productId = req.params.productId

        await Cart.updateOne({_id:cartId},{$pull : {products :{product_id :productId}}})

        req.flash("success","Xoa thanh cong")

        res.redirect('back')
    }

    //[GET]/cart/update/:productId/:quantity
    async update(req,res){
        const cartId = req.cookies.cartId
        const productId = req.params.productId
        const quantity = parseInt(req.params.quantity)

        await Cart.updateOne(
            {
                _id:cartId,
                'products.product_id':productId
            }, 
            {
                'products.$.quantity':quantity
            }
        )
        
        req.flash("success","Cap nhat thanh cong")
        res.redirect('back')
    }
}

module.exports = new index