const productSchema = {
    id: {type:Number, require:true, unique:true},
    timestamp:  { type: Date, default: Date.now , require:true },
    dateUpdate: { type: Date, default: Date.now , require:true },
    title: {type:String, require:true, max: 250},
    description: {type: String, max: 1000, require:true},
    code: {type: String, require:true, max:100},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    sales: {type: Number, require:true, max:100},
    thumbnail: {type: String, require:true},
    variations: {type: Array},
}

export default class ProductsDtoMongoDb{
    constructor() {        
        this.schema =  productSchema
        this.items = [
            {
              "id": 1,
              "timestamp": 1670683322011,
              "dateUpdate": 1670683322011,
              "title": "Poleron No me olvides",
              "description": "Poleron modelo No me Olvides",
              "code": "P0001",
              "price": 20000,
              "stock": 100,
              "sales": 0,
              "thumbnail": "/assets/img/products/ModeloNomeolvides.jpg",
              "variations": [
                {
                  "color": "",
                  "size": "",
                  "stock": 0
                }
              ]
            },
            {
              "id": 2,
              "timestamp": 1670683322011,
              "dateUpdate": 1670683322011,
              "title": "Poleron modelo Amapola",
              "description": "Poleron modelo Amapola",
              "price": 20000,
              "code": "P0002",
              "stock": 101,
              "thumbnail": "/assets/img/products/ModeloAmapola.jpg",
              "sales": 0,
              "variations": [
                {
                  "color": "",
                  "size": "",
                  "stock": 0
                }
              ]
            },
            {
              "title": "Poleron modelo Jacinto",
              "description": "Poleron modelo Jacinto",
              "price": 15000,
              "code": "P0003",
              "stock": 100,
              "thumbnail": "/assets/img/products/ModeloJacinto.jpg",
              "id": 3,
              "sales": 0,
              "timestamp": 1670683322011,
              "dateUpdate": 1670683322011,
              "variations": [
                {
                  "color": "",
                  "size": "",
                  "stock": 0
                }
              ]
            },
            {
              "id": 4,
              "timestamp": 1670683322011,
              "title": "Poleron modelo Violeta",
              "description": "Poleron modelo Violeta",
              "code": "P0004",
              "price": 22500,
              "stock": 100,
              "thumbnail": "/assets/img/products/ModeloVioleta.jpg",
              "sales": 0,
              "variations": [
                {
                  "color": "",
                  "size": "",
                  "stock": 0
                }
              ],
              "dateUpdate": 1670683637135
            },
            {
              "id": 5,
              "timestamp": 1670683322011,
              "dateUpdate": 1670683322011,
              "title": "Poleron modelo Amaranta",
              "description": "Poleron modelo Amaranta",
              "code": "P0005",
              "price": 21000,
              "stock": 100,
              "thumbnail": "/assets/img/products/ModeloAmaranta.jpg",
              "sales": 0,
              "variations": [
                {
                  "color": "",
                  "size": "",
                  "stock": 0
                }
              ]
            }
        ]      
    }  
}