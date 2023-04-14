import mongoose from "mongoose" 
import '../options/mongoDb.js'
import { customCreateError } from "../logger/errors.js"

export default class ContenedorMongoDb {
    constructor(collection, schema) {        
        this.db = mongoose.model(collection,schema)        
    } 

    async getAll() {
        try {
            return await this.db.find({})
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: getAll Error',400)
        }
    }

    async save(object){
        try {
            const newObject = this.getAll().then( resp => {
                resp.sort(function(a, b) {
                    return a.id - b.id;
                });
                let lastElement = resp[resp.length - 1];
                if( lastElement !== undefined){
                    object.id = parseInt(lastElement.id)+1
                } else {
                    object.id = resp.length+1
                }            
                object.timestamp=Date.now()
                object.dateUpdate=object.timestamp
                const aux = this.db.create(object)                
                return aux                       
            })            
            return await newObject
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: save Error',400)
        }        
    }

    async update(id,object){
        try {
            object.dateUpdate=Date.now()
            const auxObject = object
            delete auxObject._id            
            const aux = await this.db.findOneAndUpdate(
                { id : id },
                auxObject,
                {new: true}
            )           
            return [await aux]
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: update Error',400)
        }
    }

    async getById(id){   
        try {
            const aux = this.db.findOne({query: { id : id }})
            return await aux
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: getById Error',400)
        }
    }
    
    async getBy_Id(id){   
        try {
            const aux = this.db.findOne({ _id : id })
            return await aux
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: getBy_Id Error',400)
        }
    }
    
    async deleteById(id){
        try {
            const newCol = await this.db.deleteOne({ id : id }).then( () => {
                return this.getAll()
            })
            return newCol
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: deleteById Error',400)
        }
    }

    async deleteAll() {
        try {
            await this.db.deleteMany({ })
            return []
        } catch (err) {
            customCreateError(err,'ContenedorMongoDb: deleteAll Error',400)
        }
    }

    async disconnect () {
        mongoose.disconnect().catch( err => {
            customCreateError(err,'ContenedorMongoDb: disconnect Error',400)
        })
    }
}