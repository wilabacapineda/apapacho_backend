import ContenedorMongoDb from "../../../contenedores/ContenedorMongoDb.js"
import ProductsDtoMongoDb from "../../dto/products/ProductsDtoMongoDb.js"
import { customCreateError } from "../../../logger/errors.js"

const products = new ProductsDtoMongoDb()

class ProductsDaoMongoDb extends ContenedorMongoDb  {
    constructor() {                
        super('products', products.schema)
    }

    async loadFirstinsertions() {
      try{
        this.db.find({}).then( r => {
            if(r.length === 0) {   
                this.db.insertMany(products.items)
            }
        })
      } catch(err){
        customCreateError(err,'ProductDaoMongoDb: loadFirstinsertions Error',400)
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

export default ProductsDaoMongoDb