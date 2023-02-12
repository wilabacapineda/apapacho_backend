import ContenedorFile from '../../contenedores/ContenedorFile.js'

class ProductsDaoFiles extends ContenedorFile {
    constructor() {
        super('./db_json/productos.json')
    }
}

export default ProductsDaoFiles