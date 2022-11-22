import Contenedor from './contenedor.js' 

const loadProducts = () => {
    const fileP = new Contenedor('./productos.json')
    const productos = []
    const data = fileP.getAll()        
    data.then( o => {
        o.forEach( p => productos.push(p))
    })  
    return { productos, fileP }
}

export default loadProducts