import { ProductsDaoMemory, ProductsDao} from "../../model/index.js"

import { errorLogger } from "../../logger/loggerProducts.js"

const calculate = {
    getProducts:(req,res)=>{
        calculate.sendProducts(res, ProductsDaoMemory.object)        
    },
    getProductsID:(req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})           
        ProductsDaoMemory.getById(id).then( r => calculate.sendProduct(res, r)).catch( r => {      
            errorLogger(req,'getProductsByID - producto no encontrado',r)    
            calculate.sendError(res,{error: 'producto no encontrado'})                        
        })
    },
    postProducts:(req,res)=>{
        if(req.user.is_admin){
            !req.body.thumbnail ? req.body.thumbnail = `/assets/img/products/productDefault.jpg` : ''
            calculate.createProductInit(req)
            const newProd = ProductsDao.save(req.body)
                  newProd.then( np => {
                    ProductsDaoMemory.save(np)
                    calculate.sendProduct(res,np)                  
                  }).catch( r => {          
                    errorLogger(req,'postProducts - Error al ingresar el producto',r,api)    
                    calculate.sendError(res,{error: 'Error al ingresar el producto'})
                  })          
        } else {            
            errorLogger(req,'postProducts - metodo POST no autorizado','-1')                                              
            calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products', metodo POST no autorizado"})
        } 
    },
    postProductsForm:(req,res)=> {
        if(req.user.is_admin){
            calculate.createProductInit(req)  
            req.body.thumbnail = req.file ? `/assets/img/products/${req.file.filename}` : `/assets/img/products/productDefault.jpg`                
            const newProd = ProductsDao.save(req.body)                  
                  newProd.then( np => {                      
                    ProductsDaoMemory.save(np)
                    calculate.sendProduct(res,np)
                  }).catch( r => {          
                    errorLogger(req,'postProductsForm - Error al ingresar el producto',r)    
                    calculate.sendError(res,{error: 'Error al ingresar el producto'})
                  })  
        } else {
            errorLogger(req,'postProductsByForm - metodo POST no autorizado','-1')              
            calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products/form', metodo POST no autorizado"})
        } 
    },
    putProducts:(req,res)=>{
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
                                ProductsDaoMemory.update(id,np)                    
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
    },
    putProductsForm:(req,res)=>{
        if(req.user.is_admin){
            !req.body.thumbnail ? req.body.thumbnail = req.file ? `/assets/img/products/${req.file.filename}` : `/assets/img/products/productDefault.jpg` : ''
            const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})                                    
            const newProd = ProductsDao.update(id,req.body)
                  newProd.then( np => {  
                    if(np.length <= 0) {
                        errorLogger(req,'putProductsByForm - Error al actualizar el producto, producto no existe',404)    
                        calculate.sendError(res,{error: 'Error al actualizar el producto, producto no existe'})
                      } else {
                        ProductsDaoMemory.update(id,np)                                                
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
    },
    deleteProducts:(req,res)=>{
        if(req.user.is_admin){  
            const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'producto no encontrado'})                              
            const newProd = ProductsDao.getById(id)
                  newProd.then( np => {  
                    if(np && np!=null) {
                        const deleteID = ProductsDao.deleteById(id)
                              deleteID.then( np => {                          
                                ProductsDaoMemory.deleteById(id)                                       
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
            calculate.sendError(res,{ error : -1, descripcion: "Ruta '/api/products/:id', metodo DELETE no autorizado"})                
        }  
    },
    sendProducts: (res, prod) => {
        res.send(prod)  
    },
    verifyIdIsNumberNatural: (req) => {
        const id = parseInt(req.params.id)          
        if(isNaN(id) || id <= 0){          
            return false
        }
        return id
    },
    sendProduct: (res, prod) => {
        if(prod && prod!=null){
            res.send(prod)
        } else {                  
            res.send({error: 'producto no existe'})
        }
    },
    sendError: (res, error) => {
        res.send(error)
    },
    createProductInit: (req) => {
        req.body.sales = 0
        req.body.variations=[] 
        req.body.price=parseInt(req.body.price)
        req.body.stock=parseInt(req.body.stock)  
    }
}

export default calculate