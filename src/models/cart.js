const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Carts = new Schema({
    user_id: String,
    products: [
        {
            product_id: String,
            quantity: Number
        }
    ]
}
,{
  timestamps :true
})

module.exports=mongoose.model('Carts', Carts, 'carts');