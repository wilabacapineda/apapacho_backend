import ContenedorMongoDb from "../../../contenedores/ContenedorMongoDb.js"
import UsersDtoMongoDb from "../../dto/users/UsersDtoMongoDb.js"
import { customCreateError } from "../../../logger/errors.js"

const users = new UsersDtoMongoDb()

class UsersDaoMongoDb extends ContenedorMongoDb  {
    constructor() {            
        super('users', users.schema)
    }

    async getByEmail(email){   
        try {
            const aux = this.db.findOne({ email : email })
            return await aux
        } catch (err) {
            customCreateError(err,'UsersDaoMongoDb: getByEmail Error',400)
        }
    }

    async saveUser(object){
        try {            
            object.timestamp=Date.now()
            object.dateUpdate=object.timestamp
            const aux = this.db.create(object)                
            return await aux                                 
        } catch (err) {
            customCreateError(err,'UsersDaoMongoDb: saveUser Error',400)
        }        
    }

    async updateUser(object){
        try {
            object.dateUpdate=Date.now()
            const auxObject = object
            const aux = await this.db.findOneAndUpdate(
                { email : object.email },
                auxObject,
                {new: true}
            )           
            return [await aux]
        } catch (err) {
            customCreateError(err,'UsersDaoMongoDb: updateUser Error',400)
        }
    }
    
}

export default UsersDaoMongoDb