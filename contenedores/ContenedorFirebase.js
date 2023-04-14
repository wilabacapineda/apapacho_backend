import admin from 'firebase-admin'
import '../options/firebase.js'
import { customCreateError } from '../logger/errors.js'

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
            customCreateError(error,'ContenedorFirebase: getAll Error',400)
        }
    }
    
    async getById(id){   
        try {
            const response = await this.collection.doc(`${id}`).get()
            return response.data();            
        } catch (err) {
            customCreateError(error,'ContenedorFirebase: getById Error',400)
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
                this.collection.doc(`${object.id}`).create(object)                
                return this.getById(object.id)
            })            
            return await newObject
        } catch (err) {
            customCreateError(error,'ContenedorFirebase: save Error',400)
        }        
    }

    async update(id,object){
        try {
            object.dateUpdate=Date.now()
            await this.collection.doc(`${id}`).update(object)          
            const updateObject = this.getById(id)
            return [await updateObject]
        } catch (err) {
            customCreateError(error,'ContenedorFirebase: update Error',400)
        }
    }

    async deleteById(id){
        try {
            await this.collection.doc(`${id}`).delete()                  
            return this.getAll()
        } catch (err) {
            customCreateError(error,'ContenedorFirebase: deleteById Error',400)
        }
    }

    async deleteAll() {
        try {
            await this.collection.doc().delete()                  
            return []
        } catch (err) {
            customCreateError(error,'ContenedorFirebase: deleteAll Error',400)
        }
    }
}