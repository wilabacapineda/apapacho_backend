import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"
import { customCreateError } from "../../utils/errors.js"

const userSchema = {    
    email: {type: String, require: true,unique:true},
    name: {type:String, require:true, max: 250},
    lastname: {type: String, max: 250, require:true},
    password: {type: String, require:true},
    type: {type:Number, default: 4},
    address: {type: String, require: false},
    phone: {type: String, require: true},
    avatar: {type:String, require:false},
    age: {type: String, min: 0, max:200, default: 0},
    timestamp:  { type: Date, default: Date.now , require:true },
    is_admin: { type: Boolean, default: false, require:false},
    dateUpdate: { type: Date, default: Date.now , require:true },
}

class UsersDaoMongoDb extends ContenedorMongoDb  {
    constructor() {        
        super('users', userSchema)
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