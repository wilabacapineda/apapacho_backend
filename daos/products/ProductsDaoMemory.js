import ContenedorMemory from './../../contenedores/ContenedorMemory.js'
import ProductsDaoFiles from './ProductsDaoFiles.js'

const loadProducts = async () =>  {
    const file =  new ProductsDaoFiles
    const object = []
    const data = await file.getAll()     
          data.forEach( p => object.push(p))  
    return object
}
const ProductsDaoMemory = new ContenedorMemory(await loadProducts())
export default ProductsDaoMemory