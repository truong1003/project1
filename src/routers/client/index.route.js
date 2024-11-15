const homeRoutes=require('./home.route')
const productRoutes=require('./product.route')
const searchRoutes=require('./search.route')
const cartRoutes=require('./cart.route')
const checkoutRouters=require('./checkout.route')
const userRouters=require('./user.route')
const chatRouters=require('./chat.route')
const categoryMiddleware = require("../../middlwares/client/category")
const cartMiddleware = require("../../middlwares/client/cartmiddleware")
const userMiddleware = require("../../middlwares/client/usermiddleware")
const settingsGeneralMiddleware=require('../../middlwares/client/settingsmiddleware')
const authMiddleware=require('../../middlwares/client/authmiddleware')

function route(app){
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use(settingsGeneralMiddleware.settingsGeneral)
    app.use('/',homeRoutes)
    app.use('/products',productRoutes)
    app.use('/search',searchRoutes)
    app.use('/cart',cartRoutes)
    app.use('/checkout',checkoutRouters)
    app.use('/user',userRouters)
    app.use('/chat',authMiddleware.requireAuth,chatRouters)
}

module.exports = route