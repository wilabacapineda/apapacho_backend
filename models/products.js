import mongoose from "mongoose"

const productsCollection = 'productos'

const ProductVariationSchema = new mongoose.Schema({
    color: {type: String, require:true, max:100},
    size: {type: String, require:true, max:100},
    stock: {type: Number, require:true},
    
})

const ProductSchema = new mongoose.Schema({
    timestamp:  { type: Date, default: Date.now , require:true },
    dateUpdate: { type: Date, default: Date.now , require:true },
    title: {type:String, require:true, max: 250},
    description: {type: String, max: 1000, require:true},
    code: {type: String, require:true, max:100},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    sales: {type: Number, require:true, max:100},
    thumbnail: {type: String, require:true},
    variations: [ProductVariationSchema]
})

const productosDAO = mongoose.model(productsCollection, ProductSchema) 

export default productosDAO
