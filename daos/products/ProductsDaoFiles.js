import ContenedorFile from './../../contenedores/ContenedorFile.js'

class ProductsDaoFiles extends ContenedorFile {
    constructor() {
        super('./db/productos.json')
    }

    async disconnect () {
    }
}

export default ProductsDaoFiles