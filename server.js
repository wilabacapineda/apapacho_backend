import express, {json, urlencoded} from 'express'
import routers from './routers/routers.js'

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
      app.use(routers.routerCarts)
      app.use(routers.routerProducts)
      app.use('/api/', (req, res, next) => {
        res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
      })      

const server = app.listen(PORT, () =>
        console.log(`🚀 Server started on PORT ${PORT} at ${new Date().toLocaleString()}`)
      )
      server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))