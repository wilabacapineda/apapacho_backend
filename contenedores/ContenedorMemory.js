import { customCreateError } from "../utils/errors.js"

export default class ContenedorMemory {
    constructor(object) {
        this.object = object        
    } 

    async create(object) {
        try {
            this.object = object
        } catch(err){
            customCreateError(err,'ContenedorMemory: create Error',400)
        }        
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

    async getById(id){                
        try {
            const result = this.object.filter( o => parseInt(o.id) === id )  
            return await result[0]
        } catch(err){
            customCreateError(err,'ContenedorMemory: getById Error',400)
        } 
    }

    async getByIdCart(id,email){                
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.id) === id && (o.email==='' || email===o.email) && o.state==="creada"){
                    return o
                } 
            })  
            return await result[0]
        } catch(err){
            customCreateError(err,'ContenedorMemory: getById Error',400)
        } 
    }

    async getOrderByID(id,_id,email){                
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.id) === id && (o._id===_id || email===o.email)){
                    return o
                } 
            })  
            return await result[0]
        } catch(err){
            customCreateError(err,'ContenedorMemory: getOrderByID Error',400)
        } 
    }

    async getCartsByUserID(id,email){
        try {
            const result = this.object.filter( o => {
                if( parseInt(o.user_id) === id || email === o.email){
                    return o
                } 
            })  
            return await result
        } catch(err){
            customCreateError(err,'ContenedorMemory: getCartsByUserID Error',400)
        } 
    }

    async deleteById(id){        
        try {
            const indexOfItemInArray = this.object.findIndex(p => p.id === id)
            this.object.splice(indexOfItemInArray, 1)
        } catch(err){
            customCreateError(err,'ContenedorMemory: deleteById Error',400)
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