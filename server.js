import express, {json, urlencoded} from 'express'
import routerCarrito from './routers/routerCarrito.js'
import routerProductos from './routers/routerProductos.js'
import mongoose from 'mongoose'
import productsDAO from './models/products.js'
import ordersDATO from './models/orders.js'

const PORT = 8080 || process.env.PORT

const app = express()
      app.use(json())
      app.use(urlencoded({ extended: true }))
      app.use(express.static('public'))
      app.get('/api', (req,res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      app.post('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      app.put('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      app.delete('/api', (req, res) => {
        return res.send({ mensaje: "Bienvenido a la Api de Apapacho"})
      })
      app.use(routerCarrito)
      app.use(routerProductos)
      app.use('/api/', (req, res, next) => {
        res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
      })      

const server = app.listen(PORT, () =>
        console.log(`🚀 Server started on PORT ${PORT} at ${new Date().toLocaleString()}`)
      )
      server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))

/*
mongoose.connect('mongodb://localhost:27017/ecommerce',{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  serverSelectionTimeoutMS:5000,
})
.then(() => {
  inserciones.push(productsDAO.create({})
  const results = await Promise.allSettled(inserciones)
  const rejected = results.filter( res => res.status === 'rejected)
  if(rejected.length > 0){
    console.log("Error al insertar producto")
    console.log(rejected)
  } else {
    console.log("Estudiantes insertados correctamente")
  }
  await mongoose.disconnect()
})

*/