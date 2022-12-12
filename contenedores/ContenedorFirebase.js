import { query } from 'express'
import admin from 'firebase-admin'
import './../config/firebase.js'

const db = admin.firestore()

export default class ContenedorFirebase {
    constructor(collection) {                
        this.collection = db.collection(collection)       
    } 

    async getAll() {
        try {
            const response = await this.collection.get()
            return response.docs.map(doc => doc.data());            
        } catch (err) {
            console.warn(`Firebase getAll error, ${err}`)
        }
    }
    
    async getById(id){   
        try {
            const response = await this.collection.doc(`${id}`).get()
            return response.data();            
        } catch (err) {
            console.warn(`Firebase getById error, ${err}`)
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

                const aux = this.collection.doc(`${object.id}`).create(object)                
                return aux                       
            })            
            return await newObject
        } catch (err) {
            console.warn(`save error, ${err}`)
        }        
    }

    async update(id,object){
        try {
            const response = await this.collection.doc(`${id}`).update(object)          
            return [response]
        } catch (err) {
            console.warn(`Firebase update error, ${err}`)
        }
    }

    /*
    async updateProducts(id,id_prod,object,cartCount){
        try {                         
            const updateObject = await this.getAll().then( resp => {                
                const returnObject = []
                resp.forEach( c => {                
                    if(parseInt(c.id)===parseInt(id)){  
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
            const newCart = this.update(id,updateObject[0])                      
            return await newCart
        }
        catch (error) {
            console.warn(`updateProducts error, ${error}`)
        }
    }

    async deleteById(id){
        try {
            const newCol = await this.db.deleteOne({ id : id }).then( () => {
                return this.getAll()
            })
            return newCol
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }

    async deleteProducts(id,id_prod){
        try {                         
            const updateObject = await this.getAll().then( resp => {                
                const returnObject = []
                resp.forEach( c => {                
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
                    } else {
                        returnObject.push(c)
                    }
                })                
                return returnObject
            })
            
            const newCart = this.update(id,updateObject[0])                      
            return await newCart
        }
        catch (error) {
            console.warn(`updateProducts error, ${error}`)
        }
    }

    async deleteAll() {
        try {
            await this.db.deleteMany({ })
            return []
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }
    */
    
}