import express, { json, urlencoded} from 'express'
import multer, { diskStorage } from 'multer'

const { Router } = express
const administrador = true 
const storageProductImage = diskStorage({
    destination: (req, file, cb) => {
      cb(null,'public/assets/img/')
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname)
    }
})
  
const uploadProductImage = multer({storage:storageProductImage})
const routerProducts = new Router()
      routerProducts.use(json())

const routerCarts = new Router()
      routerCarts.use(json())   

import('../daos/index.js').then(module => {
  //const din = module.daoFiles()  
  //const din = module.daoMongoDb() 
  const din = module.daoFirebase() 

  routerProducts.get('/api/productos', (req,res) => {
    console.log(din.ProductsDaoMemory.object)
    res.send(din.ProductsDaoMemory.object)                  
  })      
  routerProducts.get('/api/productos/:id', (req,res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id) || id <= 0){
      return res.send({error: 'producto no encontrado'})
    }         
    const result = din.ProductsDaoMemory.getById(id)
          result.then( r => {
            res.send(r)
          }).catch( r => {
            res.send({error: 'producto no encontrado'})
          })    
  })  
  routerProducts.post('/api/productos', (req, res) => {
    if(administrador){
      req.body.sales = 0
      req.body.variations=[] 
      req.body.price=parseInt(req.body.price)
      req.body.stock=parseInt(req.body.stock)         
      const newProd = din.productsDao.save(req.body)
            newProd.then( np => {
              din.ProductsDaoMemory.save(np)
              return res.send(np)
            })      
    } else {
      res.send({ error : -1, descripcion: "Ruta '/api/productos', metodo POST no autorizado"})
    }       
  })
  routerProducts.post('/api/productos/form', uploadProductImage.single('thumbnail'), (req, res, next) => {        
    if(administrador){
      const thumbnail = req.file
      if(thumbnail){
          req.body.thumbnail = `/assets/img/${thumbnail.filename}`            
          req.body.sales = 0
          req.body.price=parseInt(req.body.price)
          req.body.stock=parseInt(req.body.stock)
          req.body.variations=[]
          const newProd = din.productsDao.save(req.body)                  
                newProd.then( np => {                      
                  din.ProductsDaoMemory.save(np)
                  return res.send(np)
                })                         
      } else {
        const error = new Error('Por favor sube un archivo')
        error.httpStatusCode = 400          
        return next(error)
      }
    } else {
      res.send({ error : -1, descripcion: "Ruta '/api/productos/form', metodo POST no autorizado"})
    }              
  })   
  routerProducts.put('/api/productos/:id', (req, res) => {
    if(administrador){
      const id = parseInt(req.params.id)   
      const newProd = din.productsDao.update(id,req.body)
            newProd.then( np => {                
              if(np.length>0){                                
                din.ProductsDaoMemory.update(id,np)                    
              }   
              np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
            })      
    } else {
      res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo PUT no autorizado"})
    }        
  })  
  routerProducts.put('/api/productos/form/:id', uploadProductImage.single('thumbnail'), (req, res,next) => {
    if(administrador){
      const thumbnail = req.file
      if(thumbnail){
        req.body.thumbnail = `/assets/img/${thumbnail.filename}`  
        const id = parseInt(req.params.id)    
        const newProd = din.productsDao.update(id,req.body)
              newProd.then( np => {  
                if(np.length>0){
                  din.ProductsDaoMemory.update(id,np)                    
                }   
                np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
              })      
      } else {
        const error = new Error('Por favor sube un archivo')
        error.httpStatusCode = 400          
        return next(error)
      }
    } else {
      res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo PUT no autorizado"})
    }        
  })      
  routerProducts.delete('/api/productos/:id', (req, res) => {
    if(administrador){
      const id = parseInt(req.params.id)     
      const newProd = din.productsDao.getById(id)
            newProd.then( np => {
              if(np===null) {
                return res.send({error: 'producto no encontrado'})
              }                
              const deleteID = din.productsDao.deleteById(id)
                    deleteID.then( np => {                          
                      din.ProductsDaoMemory.deleteById(id)
                      return res.send(np)
                    })
            }) 
    } else {
      res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo DELETE no autorizado"})
    }    
  })

  routerCarts.get('/api/carrito/:id/productos', (req, res) => {    
      const id = parseInt(req.params.id)    
      if(isNaN(id) || id <= 0){
        return res.send({error: 'carrito no encontrado'})
      } 
      const result = din.CartDaoMemory.getById(id)
            result.then( r => {
              res.send(r.products)  
            }).catch( (r) => {
              res.send({error: 'carrito no encontrado'})
            })   
  })      
  routerCarts.post('/api/carrito/', (req,res) => {
    const newCart = din.cartDao.save({products:[]})
          newCart.then( nc => {
            din.CartDaoMemory.save(nc)
            return res.send({id: nc.id})
          })   
  })
  routerCarts.post('/api/carrito/:id/productos/:id_prod', (req,res) => {        
    const id = parseInt(req.params.id)
    const id_prod = parseInt(req.params.id_prod)
    const cartCount = req.body.cartCount ? parseInt(req.body.cartCount) : 1

    if(isNaN(id) || id <= 0){
      return res.send({error: 'carrito no encontrado'})
    } 
    if(isNaN(id_prod) || id_prod <= 0){
      return res.send({error: 'producto para agregar al carrito no encontrado'})
    } 
    const result = din.ProductsDaoMemory.getById(id_prod)  
          result.then( r => {
            if(r===null) {
              return res.send({error: 'producto para agregar al carrito no encontrado'})
            }
            const newCart = din.cartDao.updateProducts(id, id_prod, r, cartCount)
                  newCart.then( (c) => {  
                    din.CartDaoMemory.update(id,c)
                    res.send(c)
                  }) 
          }).catch(r => {
            return res.send({error: 'producto para agregar al carrito no encontrado'})
          })            
  })
  
  routerCarts.delete('/api/carrito/:id', (req, res) => {
    const id = parseInt(req.params.id)    
    if(isNaN(id) || id <= 0){
      return res.send({error: 'carrito no encontrado'})
    } 
    const newCart = din.cartDao.getById(id)
          newCart.then( nc => {
            if(nc===null) {
              return res.send({error: 'carrito no encontrado'})
            }
            const deleteID = din.cartDao.deleteById(id)
                  deleteID.then( () => {
                    din.CartDaoMemory.deleteById(id)
                    return res.send({mensaje:`Carrito ${id} eliminado`})
                  })
          }) 
  })

  routerCarts.delete('/api/carrito/:id/productos/:id_prod', (req, res) => {
    const id = parseInt(req.params.id)
    const id_prod = parseInt(req.params.id_prod)
    
    if(isNaN(id) || id <= 0){
      return res.send({error: 'carrito no encontrado'})
    } 
    if(isNaN(id_prod) || id_prod <= 0){
      return res.send({error: 'producto para agregar al carrito no encontrado'})
    }      

    const Cart = din.cartDao.getById(id)
          Cart.then(cart => {
            if(cart===null) {
              return res.send({error: 'carrito no encontrado'})
            }
            const newCart = din.cartDao.deleteProducts(id, id_prod)
                  newCart.then( (c) => {  
                    din.CartDaoMemory.update(id,c)
                    res.send(c)
                  })                                
          }).catch(r => {
            return res.send({error: 'carrito no encontrado'})
          }) 
  })

})     

export default { routerProducts , routerCarts }