const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Orders = new Schema(
{
    //user_id: String,
    cart_id: String,
    userInfo:{
        fullName: String,
        phone: String,
        address: String
    },
    products:[
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ]        
}
,{
  timestamps :true
})

module.exports=mongoose.model('Orders', Orders, 'orders');