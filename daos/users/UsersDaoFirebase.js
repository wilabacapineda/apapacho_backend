import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"

class UsersDaoFirebase extends ContenedorFirebase  {
    constructor() {        
        super('users')
    }
    
    async getByEmail(email){   
        try {
            const response = await this.collection.where('email', '==', email.toLowerCase()).get()
            return response.data();            
        } catch (err) {
            console.warn(`Firebase getByEmail error, ${err}`)
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
            console.warn(`Firebase saveUser error, ${err}`)
        }        
    }

    /*
    async getByEmail(email){   
        try {
            const aux = this.db.findOne({ email : email })
            return await aux
        } catch (err) {
            console.warn(`MongoDb/UsersDaoMongoDb getByEmail error, ${err}`)
        }
    }

    async save(object){
        try {
            const newObject = this.getAll().then( resp => {
                let lastElement = resp[resp.length - 1];
                if( lastElement !== undefined){
                    object.id = parseInt(lastElement.id)+1
                } else {
                    object.id = resp.length+1
                }            
                object.timestamp=Date.now()
                object.dateUpdate=object.timestamp
                this.collection.doc(`${object.id}`).create(object)                
                return this.getById(object.id)
            })            
            return await newObject
        } catch (err) {
            console.warn(`Firebase save error, ${err}`)
        }        
    }

    async saveUser(object){
        try {            
            object.timestamp=Date.now()
            object.dateUpdate=object.timestamp
            const aux = this.db.create(object)                
            return await aux                                 
        } catch (err) {
            console.warn(`MongoDb saveUser error, ${err}`)
        }        
    }
    */
}

export default UsersDaoFirebase