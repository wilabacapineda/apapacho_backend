import ContenedorMongoDb from "./../../contenedores/ContenedorMongoDb.js"

const orderSchema = {
    id: {type:Number, require:true, unique:true},
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