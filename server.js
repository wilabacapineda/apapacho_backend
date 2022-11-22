import express, { json, urlencoded} from 'express'
import multer, { diskStorage } from 'multer'
import loadProducts from './loadProducts.js'
import loadCarritos from './loadCarritos.js'

const { Router } = express

const { productos, fileP } = loadProducts()
const { carritos, fileC } = loadCarritos()

const PORT = 8080
//const PORT = process.env.PORT

const administrador = true 

const app = express()
      app.use(json())
      app.use(urlencoded({ extended: true }))
      app.use(express.static('public'))

const storageProductImage = diskStorage({
        destination: (req, file, cb) => {
          cb(null,'public/assets/img/')
        },
        filename: (req, file, cb) => {
          cb(null,file.originalname)
        }
      })
const uploadProductImage = multer({storage:storageProductImage})

const routerProductos = new Router()
      routerProductos.use(json())
      app.get('/api', (req,res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      routerProductos.get('/api/productos', (req,res) => {
        res.send(productos)                  
      })      
      routerProductos.get('/api/productos/:id', (req,res) => {
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
          return res.send({error: 'producto no encontrado'})
        } 
        productos.forEach( o => {
          if(parseInt(o.id) === id){
            return res.send(o)
          }
        })  
      })
      app.post('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      routerProductos.post('/api/productos', (req, res) => {
        if(administrador){
          const newProd = fileP.save(req.body)
              newProd.then( np => {
                productos.push(np)
                return res.send(np)
              })      
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos', metodo POST no autorizado"})
        }       
      })
      routerProductos.post('/api/productos/form', uploadProductImage.single('thumbnail'), (req, res, next) => {        
        if(administrador){
          const thumbnail = req.file
          if(thumbnail){
              req.body.thumbnail = `/assets/img/${thumbnail.filename}`            
              const newProd = fileP.save(req.body)                  
                    newProd.then( np => {
                      productos.push(np)
                      return res.send(np)
                    })                         
          } else {
            const error = new Error('Por favor sube un archivo (2)')
            error.httpStatusCode = 400          
            return next(error)
          }
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos/form', metodo POST no autorizado"})
        }              
      })

      app.put('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      routerProductos.put('/api/productos/:id', (req, res) => {
        if(administrador){
          const id = parseInt(req.params.id)    
          const newProd = fileP.update(id,req.body)
                newProd.then( np => {  
                  if(np.length>0){
                    productos.forEach(p => {
                      if(p.id === id) {
                        const indexOfItemInArray = productos.findIndex(p => p.id === id)
                        productos.splice(indexOfItemInArray, 1, np[0])
                      }
                    })
                  }   
                  np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np[0])                
                })      
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo PUT no autorizado"})
        }
        
      })

      app.delete('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      routerProductos.delete('/api/productos/:id', (req, res) => {
        if(administrador){
          const id = parseInt(req.params.id)     
          const newProd = fileP.getById(id)
                newProd.then( np => {
                  if(np===null) {
                    return res.send({error: 'producto no encontrado'})
                  }
                  const deleteID = fileP.deleteById(id)
                  deleteID.then( np => {
                    const indexOfItemInArray = productos.findIndex(p => p.id === id)
                    productos.splice(indexOfItemInArray, 1)
                    return res.send(np)
                  })
                }) 
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo DELETE no autorizado"})
        }    
      })

const routerCarrito = new Router()
      routerCarrito.use(json())
      routerCarrito.post('/api/carrito/', (req,res) => {
        const newCart = fileC.save({productos:[]})
              newCart.then( nc => {
                carritos.push(nc)
                return res.send({id: nc.id})
              })   
      })
      routerCarrito.delete('/api/carrito/:id', (req, res) => {
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const newCart = fileC.getById(id)
              newCart.then( nc => {
                if(nc===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                const deleteID = fileC.deleteById(id)
                deleteID.then( ncc => {
                  const indexOfItemInArray = carritos.findIndex(c => c.id === id)
                  carritos.splice(indexOfItemInArray, 1)
                  return res.send({mensaje:`Carrito ${id} eliminado`})
                })
              }) 
      })
      routerCarrito.get('/api/carrito/:id/productos', (req, res) => {
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        carritos.forEach( c => {
          if(parseInt(c.id) === id){
            return res.send(c.productos)
          }
        })
      })
      routerCarrito.post('/api/carrito/:id/productos/:id_prod', (req,res) => {
        
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        let addCant = req.body.cantidad ? parseInt(req.body.cantidad) : 10

        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 
        const Cart = fileC.getById(id)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                carritos.forEach( c => {
                  if(parseInt(c.id) === id){
                    if(c.productos.length>0) {              
                      let prodBool = 0                                            
                      c.productos.forEach( cp => {
                        if(cp.id === id_prod){              
                          prodBool = 1 
                          cp.cantidad = addCant
                        }
                      })
                      
                      if(prodBool === 1) {                
                        const newCart = fileC.update(id,c)
                              newCart.then( nc => {
                                res.send(c)
                              })
                      } else {
                        let prodBool = 0
                        productos.forEach( p => {
                          if(parseInt(p.id) === id_prod){
                            prodBool = 1
                            const objNew = {
                              ... p,
                              cantidad: addCant
                            }
                            c.productos.push(objNew)                                                                             
                          }
                        })
                        if(prodBool == 1){
                          const newCart = fileC.update(id,c)
                                newCart.then( nc => {
                                  return res.send(c)
                                })
                        } else {
                          return res.send({error: 'producto para agregar al carrito no encontrado'})
                        }
                      }
                    } else {
                      let prodBool = 0
                      productos.forEach( p => {
                        if(parseInt(p.id) === id_prod){
                          prodBool = 1
                          const objNew = {
                            ... p,
                            cantidad: addCant
                          }
                          c.productos.push(objNew)                                                                             
                        }
                      })
                      if(prodBool == 1){
                        const newCart = fileC.update(id,c)
                              newCart.then( nc => {
                                return res.send(c)
                              })
                      } else {
                        return res.send({error: 'producto para agregar al carrito no encontrado'})
                      }
                    }   
                  }          
                })
              })
      })
      routerCarrito.delete('/api/carrito/:id/productos/:id_prod', (req, res) => {
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 
        const Cart = fileC.getById(id)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                carritos.forEach( c => {
                  if(parseInt(c.id) === id){
                    if(c.productos.length>0) {              
                      let prodBool = 0                                            
                      c.productos.forEach( cp => {
                        if(cp.id === id_prod){              
                          prodBool = 1 
                        }
                      })

                      if(prodBool === 1) { 
                        const indexOfItemInArray = c.productos.findIndex(cp => cp.id === id_prod)
                        c.productos.splice(indexOfItemInArray, 1)

                        const newCart = fileC.update(id,c)
                              newCart.then( nc => {
                                res.send(c)
                              })

                      } else {
                        return res.send({error: 'El carrito no contiene el producto a eliminar'})
                      }
                    } else {
                      return res.send({error: 'carrito no contiene productos'})
                    }   
                  }          
                })
              })
      })

app.use(routerProductos)
app.use(routerCarrito)
app.use('/api/', (req, res, next) => {
  console.log(req)
  res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
})

const server = app.listen(PORT, () =>
        console.log(`🚀 Server started on PORT ${PORT} at ${new Date().toLocaleString()}`)
      );
      server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))