import ContenedorMongoDb from "../../../contenedores/ContenedorMongoDb.js"
import CartDtoMongoDb from "../../dto/cart/CartDtoMongoDb.js"

const orders = new CartDtoMongoDb()

class CartDaoMongoDb extends ContenedorMongoDb  {
    constructor() {        
        super('orders', orders.schema)
    } 

    async updateProducts(id,id_prod,object,cartCount,email){
        try {                   
            const updateObject = await this.getAll().then( resp => {                               
                const returnObject = []
                resp.forEach( c => {                                    
                    if(parseInt(c.id)===parseInt(id) && (c.email===email || c.email==="") && c.state=="creada"){  
                        if(c.products.length>0){
                            const result = c.products.filter( cp => {
                                if(parseInt(cp.id) === parseInt(id_prod)) {
                                    cp.cartCount = cartCount
                                    return cp
                                }            
                            })  
                            if(result.length===0){      
                                c.products.push({
                                    ...object,
                                    cartCount : cartCount                
                                })
                            }
                        } else {
                            c.products.push({
                                ...object,
                                cartCount : cartCount                
                            })                             
                        }                                               
                        returnObject.push(c)
                    } 
                })       
                return returnObject
            })
            if(updateObject.length===0){
                return updateObject
            } else {
                const newCart = this.update(id,updateObject[0])                                  
                return await newCart
            }
        }
        catch (err) {
            customCreateError(err,'ContenedorMongoDb: updateProducts Error',400)
        }
    }

    async deleteProducts(id,id_prod){
        try {         
            const updateObject = await this.getAll().then( resp => {                                
                const returnObject = []
                let j = 0
                resp.forEach( c => {   
                    j++                              
                    if(parseInt(c.id)===parseInt(id)){  
                        if(c.products.length>0){                            
                            const result = c.products.filter( cp => {
                                if(parseInt(cp.id) !== parseInt(id_prod)) {                                    
                                    return cp
                                }            
                            })  
                            c.products = result
                            returnObject.push(c) 
                        } else {
                            returnObject.push(c)                           
                        }         
                    } 
                })   
                return returnObject[0]
            })                 
            const newCart = this.update(id,updateObject)                      
            return await newCart
        }
        catch (err) {
            customCreateError(err,'ContenedorMongoDb: deleteProducts Error',400)
        }
    }
}

export default CartDaoMongoDb