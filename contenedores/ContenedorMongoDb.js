import mongoose from "mongoose"

mongoose.connect('mongodb://localhost:27017/ecommerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverSelectionTimeoutMS:5000,
})

export default class ContenedorMongoDb {
    constructor(collection, schema) {        
        this.db = mongoose.model(collection,schema)        
    } 

    async getAll() {
        try {
            return await this.db.find({})
        } catch (err) {
            console.warn(`save error, ${err}`)
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
            console.warn(`save error, ${err}`)
        }        
    }

    async update(id,object){
        try {
            const auxObject = object
            delete auxObject._id            
            const aux = await this.db.findOneAndUpdate(
                { id : id },
                auxObject,
                {new: true}
            )           
            return [await aux]
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }

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

    async getById(id){   
        try {
            const aux = this.db.findOne({query: { id : id }})
            return await aux
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }

    async getByObjectId(id){   
        try {
            return await this.db.findOne({query: { _id : id }})
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }

    async deleteById(id){
        try {
            const newCol = await this.db.deleteOne({ id : id }).then( () => {
                return this.db.getAll()
            })
            return newCol
        } catch (err) {
            console.warn(`save error, ${err}`)
        }
    }

    async deleteByObjectId(id){
        try {
            const newCol = await this.db.deleteOne({ _id : id }).then( () => {
                return this.db.getAll()
            })
            return newCol
        } catch (err) {
            console.warn(`save error, ${err}`)
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

    async disconnect () {
        mongoose.disconnect().catch( err => {
            throw new Error(`Error al desconectar de la Base de Datos ${err}`)
        })
    }
}