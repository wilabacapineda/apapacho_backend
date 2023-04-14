export default class CartDtoMemory {
    constructor(obj){
        this.object =  createObjectDto(obj)
    }
    async createObjectDto(obj){
        return obj.map(pdm => {                
            return JSON.parse(JSON.stringify(pdm))
        } )
    }
}
/*
const CartDtoMemory = {
    createObjectDto: (object) => {
        return object.map(pdm => {                
            return JSON.parse(JSON.stringify(pdm))
        } )
    }
}
*/