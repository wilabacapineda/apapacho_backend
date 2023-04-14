import ContenedorMemory from '../../../contenedores/ContenedorMemory.js'
import CartDtoMemory from '../../dto/cart/CartDtoMemory.js'

class CartDaoMemory extends ContenedorMemory {
    constructor(){
        super()
    }

    async create(object) {
        try {       
            this.object = new CartDtoMemory(object)    
        } catch(err){            
            console.warn(`Memory Persistence create error, ${err}`)
        }        
    }

    async getOrderByID(id,_id,email){                
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.id) === id && (o._id===_id || email===o.email)){
                    return o
                } 
            })  
            return await result[0]
        } catch(err){
            customCreateError(err,'ContenedorMemory: getOrderByID Error',400)
        } 
    }

    async getCartsByUserID(id,email){
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.user_id) === id || email === o.email){
                    return o
                } 
            })  
            return await result
        } catch(err){
            customCreateError(err,'ContenedorMemory: getCartsByUserID Error',400)
        } 
    }

    async getByIdCart(id,email){                
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.id) === id && (o.email==='' || email===o.email) && o.state==="creada"){
                    return o
                } 
            })  
            return await result[0]
        } catch(err){
            customCreateError(err,'ContenedorMemory: getById Error',400)
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


export default CartDaoMemory