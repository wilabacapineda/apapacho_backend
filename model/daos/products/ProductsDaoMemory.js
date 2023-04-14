import ContenedorMemory from '../../../contenedores/ContenedorMemory.js'
import ProductsDtoMemory from '../../dto/products/ProductsDtoMemory.js'

class ProductsDaoMemory extends ContenedorMemory {
    constructor(){
        super()
    }

    async create(object) {
        try {    
            const prod = new ProductsDtoMemory(object)  
            this.object = prod.object   
        } catch(err){            
            console.warn(`Memory Persistence create error, ${err}`)
        }        
    }

    async getById(id){                
        try {
            const result = this.object.filter( o => parseInt(o.id) === id )  
            const aux = await result[0]
            return aux
        } catch(err){
            console.warn(`Memory Persistence getById error, ${err}`)
        } 
    }

    deleteById(id){        
        try {
            const indexOfItemInArray = this.object.findIndex(p => p.id === id)
            this.object.splice(indexOfItemInArray, 1)
        } catch(err){
            console.warn(`Memory Persistence deleteById error, ${err}`)
        } 
    }
}


export default ProductsDaoMemory