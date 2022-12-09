import mongoose from "mongoose"

const ordersCollection = 'orders'

const OrderBuyerSchema = new mongoose.Schema({
    user_id: {type: String, require:true},
    fullname: {type: String, require:true},
    email: {type: String, require:true},
    phone: {type: String, require:true, max:12},
})

const OrderProductSchema = new mongoose.Schema({
    product_id: {type: String, require:true},
    title: {type:String, require:true, max: 250},
    cartCount: {type: Number, require:true},
    category: {type: String, require:true},
    color: {type: String, require:true},
    size: {type: String, require:true},
    thumbnail: {type: String, require:true},
    price: {type:Number, require:true}    
})

const OrderSchema = new mongoose.Schema({
    buyer : [OrderBuyerSchema],
    dateCreate : { type: Date, default: Date.now , require:true },
    dateUpdate : { type: Date, default: Date.now , require:true },
    products : [OrderProductSchema],
    total : {type: Number, require:true}
})

const ordersDAO = mongoose.model(ordersCollection, OrderSchema)

export default ordersDAO
