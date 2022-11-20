import Contenedor from './contenedor.js' 

const loadProducts = () => {
    const file = new Contenedor('./productos.json')
    const productos = []
    const data = file.getAll()        
    data.then( o => {
        o.forEach( p => productos.push(p))
    })  
    return { productos, file }
}

export default loadProducts