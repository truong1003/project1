const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const Schema = mongoose.Schema;

const Product = new Schema({
  title:  String ,
  products_category_id:{
    type : String,
    default :""
  },
  description: String,
  price:  Number,
  discountPercentage:  Number,
  stock:  Number,
  thumbnail: String,
  status: String,
  featured: String,
  position: Number,
  slug: { 
    type: String,
    slug: "title",
    unique: true
  },
  createdBy:{
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deleted: {
    type : Boolean,
    default : false
  },
  deletedBy:{
    account_id: String,
    deletedAt: Date
  },
  updatedBy:[{
    account_id: String,
    updatedAt: Date
  }]
},{
  timestamps :true
})

module.exports=mongoose.model('Product', Product, 'products');