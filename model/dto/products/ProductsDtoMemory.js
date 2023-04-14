export default class ProductsDtoMemory {
    constructor(obj){
        this.object =  this.createObjectDto(obj)
    }
    createObjectDto(object){
        return object.map(pdm => {                
            return JSON.parse(JSON.stringify(pdm))
        } )
    }
}