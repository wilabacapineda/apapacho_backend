import Contenedor from './contenedor.js' 

const loadCarritos = () => {
    const fileC = new Contenedor('./carritos.json')
    const carritos = []
    const data = fileC.getAll()        
    data.then( o => {
        o.forEach( p => carritos.push(p))
    })  
    return { carritos, fileC }
}

export default loadCarritos