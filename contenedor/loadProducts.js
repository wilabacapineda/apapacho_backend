import Contenedor from './contenedor.js' 

const loadProducts = () => {
    const fileP = new Contenedor('./json/productos.json')
    const productosFS = []
    const data = fileP.getAll()        
    data.then( o => {
        o.forEach( p => productosFS.push(p))
    })  
    return { productosFS, fileP }
}

export default loadProducts