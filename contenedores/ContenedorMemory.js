import { customCreateError } from "../logger/errors.js"

export default class ContenedorMemory {
    constructor(object) {
        this.object = object        
    } 
    
    async save(object){
        try {
            this.object.push(object)
        } catch(err){
            customCreateError(err,'ContenedorMemory: save Error',400)
        }  
    }

    async update(id,Object){                
        try {
            const indexOfItemInArray = this.object.findIndex(p => p.id === id)
            this.object.splice(indexOfItemInArray, 1, Object[0])
        } catch(err){
            customCreateError(err,'ContenedorMemory: update Error',400)
        } 
    }

    async deleteAll() {        
        try {
            this.object=[]         
        } catch(err){
            customCreateError(err,'ContenedorMemory: deleteAll Error',400)
        } 
    }
}