import mongoose from "mongoose" 
import '../config/mongoDb.js'
import { customCreateError } from "../utils/errors.js"

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

    async updateProducts(id,id_prod,object,cartCount,email){
        try {                   
            const updateObject = await this.getAll().then( resp => {                               
                const returnObject = []
                resp.forEach( c => {                                    
                    if(parseInt(c.id)===parseInt(id) && (c.email===email || c.email==="") && c.state=="creada"){  
                        if(c.products.length>0){
                            const result = c.products.filter( cp => {
                                if(parseInt(cp.id) === parseInt(id_prod)) {
                                    cp.cartCount = cartCount
                                    return cp
                                }            
                            })  
                            if(result.length===0){      
                                c.products.push({
                                    ...object._doc,
                                    cartCount : cartCount                
                                })
                            }
                        } else {
                            c.products.push({
                                ...object._doc,
                                cartCount : cartCount                
                            })                             
                        }                                               
                        returnObject.push(c)
                    } 
                })       
                return returnObject
            })
            if(updateObject.length===0){
                return updateObject
            } else {
                const newCart = this.update(id,updateObject[0])                                  
                return await newCart
            }
        }
        catch (err) {
            customCreateError(err,'ContenedorMongoDb: updateProducts Error',400)
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

    async deleteProducts(id,id_prod){
        try {         
            const updateObject = await this.getAll().then( resp => {                                
                const returnObject = []
                let j = 0
                resp.forEach( c => {   
                    j++                              
                    if(parseInt(c.id)===parseInt(id)){  
                        if(c.products.length>0){                            
                            const result = c.products.filter( cp => {
                                if(parseInt(cp.id) !== parseInt(id_prod)) {                                    
                                    return cp
                                }            
                            })  
                            c.products = result
                            returnObject.push(c) 
                        } else {
                            returnObject.push(c)                           
                        }         
                    } 
                })   
                return returnObject[0]
            })                 
            const newCart = this.update(id,updateObject)                      
            return await newCart
        }
        catch (err) {
            customCreateError(err,'ContenedorMongoDb: deleteProducts Error',400)
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