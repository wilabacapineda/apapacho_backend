import ContenedorMemory from './../../contenedores/ContenedorMemory.js'
import CartDaoFiles from './CartDaoFiles.js'

const loadCart = async () =>  {
    const file =  new CartDaoFiles
    const object = []
    const data = await file.getAll()     
          data.forEach( p => object.push(p))  
    return object
}
const CartDaoMemory = new ContenedorMemory(await loadCart())
export default CartDaoMemory