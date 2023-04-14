import ContenedorFile from '../../../contenedores/ContenedorFile.js'

class CartDaoFiles extends ContenedorFile {
    constructor(file) {
        super(file)
    }

    async updateProducts(id,id_prod,object,cartCount){
        try {
            const content = this.getAll()            
            const updateObject = content.then( resp => {
                const returnObject = []
                const updateID = resp.map( c => {                
                    if(parseInt(c.id)===parseInt(id)){  
                        c.dateUpdate=Date.now()
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
                        return c
                    } else {
                        return c
                    }
                })                
                fs.promises.writeFile(this.file,JSON.stringify(updateID,null,2))                          
                return returnObject
            })
            return await updateObject
        }
        catch (error) {
            customCreateError(error,'ContainerFile: updateProducts Error',400)
        }
    }

    async deleteProducts(id,id_prod){
        try {                         
            const content = this.getAll()      
            const updateObject = content.then( resp => {                
                const returnObject = []
                resp.forEach( c => {                
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
                    } else {
                        returnObject.push(c)
                    }
                })                
                fs.promises.writeFile(this.file,JSON.stringify(returnObject,null,2))                          
                return returnObject
            })
            return await updateObject
        }
        catch (error) {
            customCreateError(error,'ContainerFile: deleteProducts Error',400)
        }
    }
}

export default CartDaoFiles