const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsGeneral = new Schema({
  websiteName: String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  copyright: String,
},{
  timestamps :true
})

module.exports=mongoose.model('settingsGeneral', settingsGeneral, 'settings-general');