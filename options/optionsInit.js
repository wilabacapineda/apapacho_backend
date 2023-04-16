import parseArgs from 'minimist'
import dotenv from 'dotenv'
dotenv.config()

const commandLineArgs = process.argv.slice(2)

const options = {
    alias: {
      p: 'port',
      h: 'host',
      m: 'mode',
      e: 'env',
      t: 'dbType',
      d: 'dbHost'
    },
    default : {
      env: process.env.NODE_ENV || 'dev',
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 8080,
      mode: 'fork',
      dbHost: process.env.DAO_DB || 'mongo',
      dbType: process.env.DAO_DB_TYPE || 'local'
    }
}
  
const {port, host, mode, env, dbType, dbHost, _ } = parseArgs(commandLineArgs, options)

export {port, host, mode, env, dbType, dbHost, _ }