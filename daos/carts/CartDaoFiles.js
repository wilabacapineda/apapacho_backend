import ContenedorFile from './../../contenedores/ContenedorFile.js'

class CartDaoFiles extends ContenedorFile {
    constructor() {
        super('./db/carritos.json')
    }

    async disconnect () {

    }
}

export default CartDaoFiles