const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generate=require('../helper/generate')

const Accounts = new Schema({
  fullName:  String,
  email: String,
  password: String,
  token: {
    type: String,
    default : generate.generateRandomString(20)
  },
  phone: String,
  avatar: String,
  role_id: String,
  status : String,
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

module.exports=mongoose.model('Accounts', Accounts, 'accounts');