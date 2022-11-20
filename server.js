import express, { json, urlencoded} from 'express'
import multer, { diskStorage } from 'multer'
import loadProducts from './loadProducts.js'

const { Router } = express
const { productos, file } = loadProducts()

const PORT = 8080
//const PORT = process.env.PORT

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


const routerApi = new Router()
  routerApi.get('/api/', (req,res) => {
    return res.send({ mensaje: "Esto es un get para listar"})
  })
  routerApi.get('/api/productos', (req,res) => {
    if(productos.length>0){
      res.send(productos)
    } else {
      const data = file.getAll()        
      data.then( o => {
        res.send(o)
      })
    }          
  })
  routerApi.get('/api/productoRandom', (req, res) => {
    if(productos.length>0){          
      const min = Math.ceil(1)
      const max = Math.floor(productos.length)
      const id = Math.floor(Math.random() * (max - min + 1) + min)
      productos.forEach( o => {
        if(parseInt(o.id) === parseInt(id)){
          return res.send(o)
        }
      })
    } else {
      const numberOfProducts = file.getNumberOfElements()
      numberOfProducts.then( n => {
        if(n > 0) {
          const min = Math.ceil(1)
          const max = Math.floor(n)
          const id = Math.floor(Math.random() * (max - min + 1) + min)
          const data = file.getById(id)
                data.then( o => res.send(o) )            
        } else {
          return res.send({error: 'producto no encontrado'})
        }
      })      
    }  
  })
  routerApi.get('/api/productos/:id', (req,res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id) || id <= 0){
      return res.send({error: 'producto no encontrado'})
    } 

    if(productos.length>0){
      productos.forEach( o => {
        if(parseInt(o.id) === id){
          return res.send(o)
        }
      })
    } else {
      const data = file.getById(id)
            data.then( o => {
                if ( o === null) {
                  return res.send({error: 'producto no encontrado'})
                } else {
                  return res.send(o)                          
                }                  
            })
    }         
  })

  routerApi.post('/api', (req, res) => {
    res.send({mensaje: 'esto es un post para crear'})
  })
  routerApi.post('/api/productos', (req, res) => {
    const newProd = file.save(req.body)
          newProd.then( np => {
            productos.push(np)
            return res.send(np)
          })      
  })
  routerApi.post('/api/productos/form', uploadProductImage.single('thumbnail'), (req, res, next) => {        
    const thumbnail = req.file
    if(!thumbnail){
      if(req.body.thumbnail){
        req.body.thumbnail = `/assets/img/${req.body.thumbnail}`            
        const newProd = file.save(req.body)                  
              newProd.then( np => {
                productos.push(np)
                return res.send(np)
              })             
      } else {
        const error = new Error('Por favor sube un archivo')
        error.httpStatusCode = 400          
        return next(error)
      }
    } else {
      req.body.thumbnail = `/assets/img/${thumbnail.filename}`
      const newProd = file.save(req.body)
            newProd.then( np => {
              productos.push(np)
              return res.redirect(`/productos/${np.id}`)
            }) 
    }        
  })

  routerApi.put('/api', (req, res) => {
    res.send({mensaje: 'esto es un put para actualizar'})
  })
  routerApi.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    const newProd = file.update(id,req.body)
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
  })

  routerApi.delete('/api', (req, res) => {
    res.send({mensaje: 'esto es un delete para borrar'})
  })
  routerApi.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)     
    const newProd = file.getById(id)
          newProd.then( np => {
            if(np===null) {
              return res.send({error: 'producto no encontrado'})
            }
            const deleteID = file.deleteById(id)
            deleteID.then( np => {
              const indexOfItemInArray = productos.findIndex(p => p.id === id)
              productos.splice(indexOfItemInArray, 1)
              return res.send(np)
            })
          }) 
          
  })

const server = app.listen(PORT, () =>
        console.log(`🚀 Server started on PORT ${PORT} at ${new Date().toLocaleString()}`)
      );
      server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))