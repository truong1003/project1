const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roles = new Schema({
  title:  String ,
  description: String,
  permission:{
    type : Array,
    default: []
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

module.exports=mongoose.model('Role', Roles, 'roles');