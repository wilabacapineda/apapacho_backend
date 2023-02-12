import parseArgs from 'minimist'
import dotenv from 'dotenv'
dotenv.config()

const options = {
    alias: {
      p: 'port',
      m: 'mode'
    },
    default : {
      port: process.env.PORT || 8080,
      mode: 'fork'
    }
}
  
const commandLineArgs = process.argv.slice(2)

export const {port, mode, _ } = parseArgs(commandLineArgs, options)