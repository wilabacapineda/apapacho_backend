import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"

class ProductDaoFirebase extends ContenedorFirebase  {
    constructor() {        
        super('products')
    }

    async loadFirstinsertions() {
        try {
            const products = [
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
            
            const productos = this.getAll()
                  productos.then( prod => {
                    if(prod.length===0){
                        products.forEach( p => {                
                            this.collection.doc(`${p.id}`).create(p)
                        })
                        console.log('Datos de Productos Insertados en Firebase')
                    }
                  })
        } catch(err){
            console.warn(`loadFirstinsertions error, ${err}`)
        }
    } 
    
}

export default ProductDaoFirebase