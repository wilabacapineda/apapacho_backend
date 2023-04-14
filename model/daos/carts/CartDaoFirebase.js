import ContenedorFirebase from "../../../contenedores/ContenedorFirebase.js"

class CartDaoFirebase extends ContenedorFirebase  {
    constructor() {        
        super('orders')
    }
    
}

export default CartDaoFirebase