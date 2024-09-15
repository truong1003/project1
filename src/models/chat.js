const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chats = new Schema({
    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt: Date
}
,{
  timestamps :true
})

module.exports=mongoose.model('Chats', Chats, 'chats');