//import UsersDaoFirebase from './users/UsersDaoFirebase.js'
import UsersDaoMongoDb from './users/UsersDaoMongoDB.js'

const users = new UsersDaoMongoDb

export default users