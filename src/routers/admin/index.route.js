const dashboardRoutes=require('./dashboard.route')
const productdRoutes=require('./products.route')
const productdCategoryRoutes=require('./products-category.route')
const rolesRoutes=require('./roles.route')
const accountsRoutes=require('./accounts.route')
const authRoutes=require('./auth.route')
const myAccountRouter=require('./my-account')
const settingsRouter=require('./settings.route')
const systemConfig=require('../../config/system')
const authMiddleware=require("../../middlwares/admin/auth")
function route(app){
    const PATH_ADMIN=systemConfig.prefixAdmin
    app.use( PATH_ADMIN+'/dashboard',authMiddleware.requireAuth,dashboardRoutes)
    app.use( PATH_ADMIN+'/products',authMiddleware.requireAuth,productdRoutes)
    app.use(PATH_ADMIN+'/products-category',authMiddleware.requireAuth,productdCategoryRoutes)
    app.use(PATH_ADMIN+'/roles',authMiddleware.requireAuth,rolesRoutes)
    app.use(PATH_ADMIN+'/accounts',authMiddleware.requireAuth,accountsRoutes)
    app.use(PATH_ADMIN+'/auth',authRoutes)
    app.use(PATH_ADMIN+'/my-account',authMiddleware.requireAuth,myAccountRouter)
    app.use(PATH_ADMIN+'/settings',authMiddleware.requireAuth,settingsRouter)
}

module.exports = route