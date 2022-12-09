import Contenedor from './contenedor.js' 

const loadCarritos = () => {
    const fileC = new Contenedor('./json/carritos.json')
    const orderFS = []
    const data = fileC.getAll()        
    data.then( o => {
        o.forEach( p => orderFS.push(p))
    })  
    return { orderFS, fileC }
}

export default loadCarritos