const mongoose= require('mongoose')
async function  connect(){
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connect thanh cong')
    } catch (error) {
        console.log('fail')
    }
}

module.exports= { connect }