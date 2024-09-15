const Cart=require("../../models/cart")
const Order=require("../../models/orders")
const Products=require("../../models/Product")
const helperProduct=require("../../helper/product")

class index{
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
        res.render("client/pages/checkout/index",{
            titlePage: "Đặt hàng",
            cartDetail:cart
        })
    }   

    //[POST]/order
    async order(req,res){
        const cartId = req.cookies.cartId
        const userInfo= req.body
        
        const cart = await Cart.findOne({_id:cartId })

        let products=[]

        for(const product of cart.products){
            const objectProduct={
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity
            }

            const productInfo = await Products.findOne({_id :product.product_id})

            objectProduct.price=productInfo.price
            objectProduct.discountPercentage=productInfo.discountPercentage

            products.push(objectProduct)
        }

        const objectOrder={
            cart_id: cartId,
            userInfo:userInfo,
            products:products
        }

        const order = new Order(objectOrder)
        await order.save()

        await Cart.updateOne({
            _id:cartId,
        },{
            products: []
        })

        res.redirect(`/checkout/success/${order.id}`)
    }

    async success(req,res){

        const order= await Order.findOne({_id:req.params.orderId})

        for( const product of order.products){
            const productInfo = await Products.findOne({_id:product.product_id}).select("title thumbnail")

            product.productInfo=productInfo
            product.newPrice=helperProduct.priceNewProduct(product)
            product.totalPrice=product.newPrice * product.quantity
        }

        order.totalPrice= order.products.reduce((sum,item) => sum + item.totalPrice ,0)
        
        res.render("client/pages/checkout/success",{
            titlePage:"Đăt hàng thành công",
            order: order
        })
    }
}

module.exports= new index