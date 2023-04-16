import winston from 'winston'
import { env } from '../options/optionsInit.js'

const bluidProdLogger = () => {
    const prodLogger = winston.createLogger({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        transports: [
          new winston.transports.File({ filename: './logs/error.log', level:'error' }),
          //new winston.transports.File({ filename: './logs/info.log', level:'info' }),
          new winston.transports.File({ filename: './logs/warn.log', level:'warn' }),
          new winston.transports.Console({ level:'info' }),
          new winston.transports.Console({ level: 'warn' }),
          new winston.transports.Console({ level: 'error' }),          
        ],
    })
    return prodLogger
}

const bluidDevLogger= () => {
    const devLogger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          transports: [
            new winston.transports.Console({ level:'info' }),
            new winston.transports.Console({ level: 'warn' }),
            new winston.transports.Console({ level: 'error' }),
          ],
    })
    return devLogger
}

let logger = null

if(env === 'prod'){
    logger = bluidProdLogger();
} else {
    logger = bluidDevLogger();
}
export default logger