import ContenedorFile from '../../contenedores/ContenedorFile.js'

class CartDaoFiles extends ContenedorFile {
    constructor() {
        super('./db_json/carritos.json')
    }
}

export default CartDaoFiles