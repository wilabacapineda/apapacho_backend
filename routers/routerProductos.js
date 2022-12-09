import express, { json, urlencoded} from 'express'
import loadProducts from './../contenedor/loadProducts.js'
import multer, { diskStorage } from 'multer'

const { Router } = express
const { productosFS, fileP } = loadProducts()
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

const routerProductos = new Router()
      routerProductos.use(json())      
      routerProductos.get('/api/productos', (req,res) => {
        res.send(productosFS)                  
      })      
      routerProductos.get('/api/productos/:id', (req,res) => {
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
          return res.send({error: 'producto no encontrado'})
        } 
        let prodBool = 0
        let aux
        productosFS.forEach( o => {
          if(parseInt(o.id) === id){
            prodBool = 1
            aux = o          }
        })  
        if(prodBool == 1){
          return res.send(aux)
        } else {
          return res.send({error: 'producto no encontrado'})
        }
      })      
      routerProductos.post('/api/productos', (req, res) => {
        if(administrador){
          const newProd = fileP.save(req.body)
              newProd.then( np => {
                productosFS.push(np)
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
                      productosFS.push(np)
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
      routerProductos.put('/api/productos/:id', (req, res) => {
        if(administrador){
          const id = parseInt(req.params.id)   
          const newProd = fileP.update(id,req.body)
                newProd.then( np => {  
                  if(np.length>0){
                    productosFS.forEach(p => {
                      if(p.id === id) {
                        const indexOfItemInArray = productosFS.findIndex(p => p.id === id)
                        productosFS.splice(indexOfItemInArray, 1, np[0])
                      }
                    })
                  }   
                  np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np[0])                
                })      
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo PUT no autorizado"})
        }        
      })  
      routerProductos.put('/api/productos/form/:id', uploadProductImage.single('thumbnail'), (req, res,next) => {
        if(administrador){
          const thumbnail = req.file
          if(thumbnail){
            req.body.thumbnail = `/assets/img/${thumbnail.filename}`            
            const id = parseInt(req.params.id)    
            const newProd = fileP.update(id,req.body)
                  newProd.then( np => {  
                    if(np.length>0){
                      productosFS.forEach(p => {
                        if(p.id === id) {
                          const indexOfItemInArray = productosFS.findIndex(p => p.id === id)
                          productosFS.splice(indexOfItemInArray, 1, np[0])
                        }
                      })
                    }   
                    np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np[0])                
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
                    const indexOfItemInArray = productosFS.findIndex(p => p.id === id)
                    productosFS.splice(indexOfItemInArray, 1)
                    return res.send(np)
                  })
                }) 
        } else {
          res.send({ error : -1, descripcion: "Ruta '/api/productos/:id', metodo DELETE no autorizado"})
        }    
      })

export default routerProductos