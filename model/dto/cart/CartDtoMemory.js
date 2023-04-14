export default class CartDtoMemory {
    constructor(obj){
        this.object =  this.createObjectDto(obj)
    }
    createObjectDto(obj){
        return obj.map(pdm => {                
            return JSON.parse(JSON.stringify(pdm))
        } )
    }
}
