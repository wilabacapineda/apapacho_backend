import { dbType } from '../../../options/optionsInit.js'
import UsersDaoMongoDb from './UsersDaoMongoDb.js'
import UsersDaoFirebase from './UsersDaoFirebase.js'
import dotenv from 'dotenv'
dotenv.config()

const daoUsers = {
    users: ''
}

switch(dbType){
    case "mongo":        
        daoUsers.users = new UsersDaoMongoDb
        break
    case 'firebase':        
        daoUsers.users = new UsersDaoFirebase
        break
    default:        
        daoUsers.users = new UsersDaoMongoDb
        break
}

export default daoUsers