import ContenedorFirebase from "../../../contenedores/ContenedorFirebase.js"
import ProductsDtoFirebase from "../../dto/products/ProductsDtoFirebase.js"
import { customCreateError } from "../../../logger/errors.js"

const products = new ProductsDtoFirebase()

class ProductDaoFirebase extends ContenedorFirebase  {
    constructor() {        
        super('products')
    }

    async loadFirstinsertions() {
        try {
            const productos = this.getAll()
                  productos.then( prod => {
                    if(prod.length===0){
                        products.items.forEach( p => {                
                            this.collection.doc(`${p.id}`).create(p)
                        })                        
                    }
                  })
        } catch(err){
          customCreateError(err,'ProductDaoFirebase: loadFirstinsertions Error',400)
        }
    } 

        
    async updateProducts(id,id_prod,object,cartCount){
      try {            
          const updateObject = await this.getAll().then( resp => {                
              const returnObject = []
              resp.forEach( c => {                
                  if(parseInt(c.id)===parseInt(id)){  
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
          const newCart = this.update(id,updateObject[0])                      
          return await newCart
      }
      catch (error) {
          customCreateError(error,'ContenedorFirebase: updateProducts Error',400)
      }
    }

    async deleteProducts(id,id_prod){
      try {                         
          const updateObject = await this.getAll().then( resp => {                
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
              return returnObject
          })            
          const newCart = this.update(id,updateObject[0])                      
          return await newCart
      }
      catch (error) {
          customCreateError(error,'ContenedorFirebase: deleteProducts Error',400)
      }
    }
    
}

export default ProductDaoFirebase