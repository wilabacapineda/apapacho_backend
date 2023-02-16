import logger from "./winston.js"

const customCreateError = (err,message='',httpStatusCode=400, context='',req='',type='error') => {    
    const error = new Error( message, { cause: err })
          error.httpStatusCode=httpStatusCode   
    if(type==='error'){
      logger.error(`{Error:${httpStatusCode}, Route:${req.url}, Message:${message}, Error: ${err}}`)
    } else {
      logger.warn(`{Error:${httpStatusCode}, Route:${req.url}, Message:${message}, Error: ${err}}`)
    }
    
    return error
}

const dataCreateError = (err,message='',httpStatusCode=400, context='',req='',type='error') => {    
    const error = new Error( message, { cause: err })
          error.httpStatusCode=httpStatusCode        
    if(type==='error'){
      logger.error(`{Error:${httpStatusCode}, Route:${req.url}, Message:${message}, Error: ${err}}`)
    } else if (type==='warn'){
      logger.warn(`{Error:${httpStatusCode}, Route:${req.url}, Message:${message}, Error: ${err}}`)
    }    
    const data = {
      ...context,
      httpStatusCode: httpStatusCode,
    }
    return data
}

export {customCreateError, dataCreateError }