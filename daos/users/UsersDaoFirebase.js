import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"
import { customCreateError } from "../../utils/errors.js";

class UsersDaoFirebase extends ContenedorFirebase  {
    constructor() {        
        super('users')
    }
    
    async getByEmail(email){   
        try {
            const response = await this.collection.where('email', '==', email.toLowerCase()).get()
            return response.data();            
        } catch (err) {
            customCreateError(err,'UsersDaoFirebase: getByEmail Error',400)
        }
    }

    async saveUser(object){
        try {
            const newObject = this.getAll().then( resp => {                       
                object.timestamp=Date.now()
                object.dateUpdate=object.timestamp
                this.collection.doc(`${object.id}`).create(object)                
                return this.getById(object.id)
            })            
            return await newObject
        } catch (err) {
            customCreateError(err,'UsersDaoFirebase: saveUser Error',400)
        }        
    }

    async updateUser(id,object){
        try {
            object.dateUpdate=Date.now()
            await this.collection.where('email', '==', email.toLowerCase()).update(object)          
            const updateObject = this.getById(id)
            return [await updateObject]
        } catch (err) {
            customCreateError(error,'UsersDaoFirebase: updateUser Error',400)
        }
    }
}

export default UsersDaoFirebase