import logger from "../utils/winston.js"

const runLogger = (req) => {
    const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
    logger.info(`{route:/api/carrito${routex}, method:${req.method}}`)
  }
  
const errorLogger = (req,f,err) => {
    const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
    logger.error(`{function:${f}, route:/api/carrito${routex}, method:${req.method}, error:${err}}`)
}

export {runLogger, errorLogger}