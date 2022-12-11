export default class ContenedorMemory {
    constructor(object) {
        this.object = object        
    } 

    create(object) {
        this.object = object
    }
    
    save(Object){
        this.object.push(Object)
    }

    update(id,Object){        
        const indexOfItemInArray = this.object.findIndex(p => p.id === id)
        this.object.splice(indexOfItemInArray, 1, Object[0])
    }

    async getById(id){        
        const result = this.object.filter( o => parseInt(o.id) === id )  
        return await result[0]
    }

    deleteById(id){
        const indexOfItemInArray = this.object.findIndex(p => p.id === id)
        this.object.splice(indexOfItemInArray, 1)
    }

    deleteAll() {
        this.object=[]         
    }
}