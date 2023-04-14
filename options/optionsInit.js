import parseArgs from 'minimist'
import dotenv from 'dotenv'
dotenv.config()

const options = {
    alias: {
      p: 'port',
      h: 'host',
      m: 'mode',
      e: 'env',
      dbt: 'DBType',
      dbh: 'DBHost'
    },
    default : {
      port: process.env.PORT || 8080,
      host: process.env.HOST || 'localhost',
      mode: 'fork',
      env: process.env.NODE_ENV || 'DEV',
      dbType: process.env.DAO_DB || 'mongo',
      dbHost: process.env.DAO_DB_TYPE || 'local'
    }
}
  
const commandLineArgs = process.argv.slice(2)

export const {port, host, mode, env, dbType, dbHost, _ } = parseArgs(commandLineArgs, options)