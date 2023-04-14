import express, {json, urlencoded} from 'express'
import cookieParser from 'cookie-parser'
import compress from './compress/compress.js'
import { create } from 'express-handlebars'
import routerPassport from './passport/passport.js'
import { sessionOptions } from './options/sessionOptions.js'
import { port, host, mode, env, dbType, dbHost, _ } from './options/optionsInit.js'
import router from './routes/index.js'
import cluster from 'cluster'
import clusterFork from './cluster/clusterPrimary.js'
import hbsCreate from './utils/hbs.js'
import corsUse from "./cors/cors.js"

if (cluster.isPrimary && mode==='cluster') {
  clusterFork(cluster)
} else {
  const hbs = create(hbsCreate)
  const app = express()
        app.use(compress)        
        app.use(json())
        app.use(cookieParser())    
        app.use(urlencoded({ extended: true }))        
        app.use(sessionOptions)
        app.use(routerPassport)
        app.use(corsUse)        
        app.use(express.static('public'))
        app.engine('handlebars',hbs.engine)
        app.set('view engine','handlebars')
        app.set("views", "./views")
        app.use(router)
        app.use('/api/', (req, res, next) => {
          res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
        })      

  const server = app.listen(port, () => {
                  console.warn('Environment Type (env):',env)
                  console.warn('DB Factory (dbType):',dbType,dbType === "mongo" ? `- ${dbHost}` : '')
                  console.warn('Host:',host)
                  console.warn('Mode:',mode)
                  console.log(`🚀 Server started on PORT ${port} - PID ${process.pid} at ${new Date().toLocaleString()}`)
                })
        server.on("error", error => console.log(`Error al iniciar servidor, ${error}`))
}