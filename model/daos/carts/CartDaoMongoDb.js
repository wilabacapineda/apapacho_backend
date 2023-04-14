import ContenedorMongoDb from "../../../contenedores/ContenedorMongoDb.js"
import CartDtoMongoDb from "../../dto/cart/CartDtoMongoDb.js"

const orders = new CartDtoMongoDb()

class CartDaoMongoDb extends ContenedorMongoDb  {
    constructor() {        
        super('orders', orders.schema)
    } 
}

export default CartDaoMongoDb