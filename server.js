import express, {json, urlencoded} from 'express'
import { port, mode, _ } from './utils/optionsInit.js'
import router from './routes/index.js'
import compression from 'compression'
import shouldCompress from './utils/compress.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { sessionOptions, localStrategy } from './utils/sessionFunctions.js'
import users from './daos/loadUsers.js'
import cluster from 'cluster'
import {cpus} from 'os'
import { create } from 'express-handlebars'
import hbHelpers from './utils/hbHelpers.js'

if(cluster.isPrimary && mode==='cluster') {
  console.log(`Primary PID ${process.pid} is running`)
  const numCPUs = cpus().length
  for(let i=0; i< numCPUs; i++){
      cluster.fork()
  }

  cluster.on('exit', worker => {
      console.log(`worker ${worker.process.pid} died`, new Date().toLocaleString())
      cluster.fork()
  })
  
} else {
  const hbs = create({
    partialsDir: "views/partials/",    
    defaultLayout: 'main',
    helpers:  hbHelpers
  })
  
  passport.use('login', localStrategy)
  passport.serializeUser((user, done) => { done(null, user._id) })
  passport.deserializeUser((id, done) => { users.db.findById(id, done) })
  const app = express()
        app.use(compression({
          filter: shouldCompress,
          level: 7,
        }))
        app.use(json())
        app.use(urlencoded({ extended: true }))
        app.use(sessionOptions)
        app.use(passport.initialize())
        app.use(passport.session())    
        app.use(cookieParser())    
        app.use(express.static('public'))
        app.engine('handlebars',hbs.engine)
        app.set('view engine','handlebars')
        app.set("views", "./views")
        app.use(router)
        app.use('/api/', (req, res, next) => {
          res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
        })      

  const server = app.listen(port, () =>
          console.log(`🚀 Server started on PORT ${port} - PID ${process.pid} at ${new Date().toLocaleString()}`)
        )
        server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))
}