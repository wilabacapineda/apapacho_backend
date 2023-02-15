import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

const orderSchema = {
    id: {type:Number, require:true, unique:true},
    user_id: {type:String, default:''},
    email: {type:String, default:''},
    fullname: {type:String, default:''},
    address: {type:String, default:''},
    phone: {type:String, default:''},
    state: {type:String, default: 'creada'},
    total: {type:Number, default: 0},
    timestamp : { type:Date, default: Date.now , require:true },
    dateUpdate : { type: Date, default: Date.now , require:true },
    products : { type: Array },
}

class CartDaoMongoDb extends ContenedorMongoDb  {
    constructor() {        
        super('orders', orderSchema)
    }    
}

export default CartDaoMongoDb