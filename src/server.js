const express = require('express')
const app = express()
const path=require('path')
const router=require('./routers/client/index.route')
const routerAdmin=require('./routers/admin/index.route')
const db=require('./config/configDB')
require('dotenv').config()
const port = process.env.PORT
const methodOverride = require('method-override')
const systemConfig=require('./config/system')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const moment = require('moment')
const cookieParser = require('cookie-parser')
const session = require('express-session')
db.connect()



//config template engine
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname,'public')))
//config statci file

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Flash Messages
app.use(cookieParser('KEYMEAT'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash())

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin=systemConfig.prefixAdmin
app.locals.moment=moment


app.use(methodOverride('_method'))
routerAdmin(app)
router(app)
app.get("*",(req,res)=>{
  res.render("client/pages/errors/404",{
    titlePage:"404 Not Found"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})