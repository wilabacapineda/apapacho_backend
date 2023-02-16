import logger from "./winston.js"

const runLogger = (req,message='') => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:/session${routex}, method:${req.method} ${ message === '' ? '':`, customMessage:${message}`}}`)
}

const errorLogger = (req,f,err) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.error(`{function:${f}, route:/session${routex}, method:${req.method}, error:${err}}`)
}

export { runLogger, errorLogger }