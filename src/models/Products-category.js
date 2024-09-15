const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const Schema = mongoose.Schema;

const ProductCategory = new Schema({
  title:  String ,
  parent_id: {
    type : String,
    default : "",
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: { 
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type : Boolean,
    default : false
  },
  deletedAt : Date,
  createdBy:{
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
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

module.exports=mongoose.model('ProductCategory', ProductCategory, 'products-category');