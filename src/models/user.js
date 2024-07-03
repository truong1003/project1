const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generate=require('../helper/generate')

const Users = new Schema({
  fullName:  String,
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default : generate.generateRandomString(20)
  },
  phone: String,
  avatar: String,
  status : {
    type : String,
    default: "active"
  },
  deleted: {
    type : Boolean,
    default : false
  },
  deletedAt: Date
},{
  timestamps :true
})

module.exports=mongoose.model('Users', Users, 'users');