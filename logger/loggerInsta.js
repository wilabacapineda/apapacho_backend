import logger from "./winston.js"

const runLogger = () => {  
  logger.info(`{service:instagram, method:update }`)
}

const errorLogger = (err) => {  
  logger.error(`{service:instagram, method:update , error:${err}}`)
}

export { runLogger, errorLogger }