import din from "../../model/index.js"
import { runLogger, errorLogger } from "../../logger/loggerProducts.js"
import { sessionCounter } from "../../controlSession/functions.js"
import calculate from './products.calculate.js'

const controller = {
    getProducts: async (req,res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            calculate.sendProducts(res, din.ProductsDaoMemory.object)        
        } catch(err) {
            errorLogger(req,'getProducts',err)            
        }        
    },
    getProductsID: async (req,res) => {
        try {
            sessionCounter(req)
            runLogger(req)
            const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})           
            din.ProductsDaoMemory.getById(id).then( r => calculate.sendProduct(res, r)).catch( r => {      
                errorLogger(req,'getProductsByID - producto no encontrado',r)    
                calculate.sendError(res,{error: 'producto no encontrado'})                        
            })
        } catch(err) {
            errorLogger(req,'getProductsByID',err)
        } 
    },
    postProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.user.is_admin===true){
                !req.body.thumbnail ? req.body.thumbnail = `/assets/img/products/productDefault.jpg` : ''
                calculate.createProductInit(req)
                const newProd = din.ProductsDao.save(req.body)
                      newProd.then( np => {
                        din.ProductsDaoMemory.save(np)
                        calculate.sendProduct(res,np)                  
                      }).catch( r => {          
                        errorLogger(req,'postProducts - Error al ingresar el producto',r,api)    
                        calculate.sendError(res,{error: 'Error al ingresar el producto'})
                      })          
            } else {
                errorLogger(req,'postProducts - metodo POST no autorizado','-1')                                              
                calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products', metodo POST no autorizado"})
            } 
            
  

        } catch(err) {
            errorLogger(req,'postProducts',err)
        } 
            
    },
    postProductsForm: async (req, res) => {   
        try{
            sessionCounter(req)
            runLogger(req)     
            if(req.user.is_admin){
                calculate.createProductInit(req)  
                req.body.thumbnail = req.file ? `/assets/img/products/${req.file.filename}` : `/assets/img/products/productDefault.jpg`                
                const newProd = din.ProductsDao.save(req.body)                  
                      newProd.then( np => {                      
                        din.ProductsDaoMemory.save(np)
                        calculate.sendProduct(res,np)
                      }).catch( r => {          
                        errorLogger(req,'postProductsForm - Error al ingresar el producto',r)    
                        calculate.sendError(res,{error: 'Error al ingresar el producto'})
                      })  
            } else {
                errorLogger(req,'postProductsByForm - metodo POST no autorizado','-1')              
                calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products/form', metodo POST no autorizado"})
            }              
        } catch(err) {
            errorLogger(req,'postProductsByForm',err)
        }
    },
    putProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.user.is_admin){
                const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})          
                !req.body.thumbnail ? req.body.thumbnail = `/assets/img/products/productDefault.jpg` : ''            
                if(id){
                    const newProd = ProductsDao.update(id,req.body)
                        newProd.then( np => {                
                                if(np.length <= 0) {
                                    errorLogger(req,'putProducts - Error al actualizar el producto, producto no existe',404)    
                                    calculate.sendError(res,{error: 'Error al actualizar el producto, producto no existe'})
                                } else {
                                    din.ProductsDaoMemory.update(id,np)                    
                                    calculate.sendProduct(res,np)                                  
                                }
                        }).catch( r => {          
                            errorLogger(req,'putProducts - Error al actualizar el producto',r)    
                            calculate.sendError(res,{error: 'Error al actualizar el producto'})
                        })      
                } else {
                    errorLogger(req,'putProducts - producto no encontrado','400')    
                    calculate.sendError(res,{error: 'producto no encontrado'})
                }
            } else {
                errorLogger(req,'putProducts - metodo PUT no autorizado','-1')              
                calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})
            }   
        } catch(err) {
            errorLogger(req,'putProducts',err)
        }    
    },
    putProductsForm: async (req, res) => {
        try {
            sessionCounter(req)
            runLogger(req)
            if(req.user.is_admin){
                !req.body.thumbnail ? req.body.thumbnail = req.file ? `/assets/img/products/${req.file.filename}` : `/assets/img/products/productDefault.jpg` : ''
                const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})                                    
                const newProd = din.ProductsDao.update(id,req.body)
                      newProd.then( np => {  
                        if(np.length <= 0) {
                            errorLogger(req,'putProductsByForm - Error al actualizar el producto, producto no existe',404)    
                            calculate.sendError(res,{error: 'Error al actualizar el producto, producto no existe'})
                          } else {
                            din.ProductsDaoMemory.update(id,np)                                                
                            calculate.sendProduct(res,np) 
                          }
                      }).catch( r => {          
                        errorLogger(req,'putProductsByForm - Error al actualizar el producto',r)    
                        calculate.sendError(res,{error: 'Error al actualizar el producto'})
                      })
            } else {
                errorLogger(req,'putProductsByForm - metodo PUT no autorizado','-1')              
                calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})                
            }        
        } catch(err) {
            errorLogger(req,'putProductsByForm',err)
        }
    },
    deleteProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.user.is_admin){  
                const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})                              
                const newProd = din.ProductsDao.getById(id)
                      newProd.then( np => {  
                        if(np && np!=null) {
                            const deleteID = din.ProductsDao.deleteById(id)
                                  deleteID.then( np => {                          
                                    din.ProductsDaoMemory.deleteById(id)                                       
                                    calculate.sendProduct(res,np) 
                                  })                    
                        } else {
                                errorLogger(req,'deleteProducts - producto no encontrado, producto no existe',404)    
                                calculate.sendError(res,{error: 'producto no encontrado, producto no existe'})
                              }  
                      }).catch( r => {          
                        errorLogger(req,'deleteProducts - producto no encontrado',r)    
                        calculate.sendError(res,{error: 'producto no encontrado'})
                      })
            } else {
                errorLogger(req,'deleteProducts - metodo DELETE no autorizado','-1')              
                calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/productos/:id', metodo DELETE no autorizado"})                
            }    
        } catch(err) {
            errorLogger(req,'deleteProducts',err)
        } 
    },
}

export default controller