import din from "../../daos/index.js"

const administrador = true 

const controller = {
    getProducts: async (req,res) => {
        res.send(din.ProductsDaoMemory.object)                  
    },
    getProductsID: async (req,res) => {
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
            return res.send({error: 'producto no encontrado'})
        }         
        const result = din.ProductsDaoMemory.getById(id)
                result.then( r => {
                res.send(r)
                }).catch( r => {
                res.send({error: 'producto no encontrado'})
                })    
    },
    postProducts: async (req, res) => {
        if(administrador){
            req.body.sales = 0
            req.body.variations=[] 
            req.body.price=parseInt(req.body.price)
            req.body.stock=parseInt(req.body.stock)         
            const newProd = din.productsDao.save(req.body)
                newProd.then( np => {
                    din.ProductsDaoMemory.save(np)
                    return res.send(np)
                })      
        } else {
            res.send({ error : -1, descripcion: "Ruta '/api/products', metodo POST no autorizado"})
        }       
    },
    postProductsForm: async (req, res, next) => {        
        if(administrador){
            const thumbnail = req.file
            if(thumbnail){
                req.body.thumbnail = `/assets/img/${thumbnail.filename}`            
                req.body.sales = 0
                req.body.price=parseInt(req.body.price)
                req.body.stock=parseInt(req.body.stock)
                req.body.variations=[]
                const newProd = din.productsDao.save(req.body)                  
                    newProd.then( np => {                      
                        din.ProductsDaoMemory.save(np)
                        return res.send(np)
                    })                         
            } else {
            const error = new Error('Por favor sube un archivo')
            error.httpStatusCode = 400          
            return next(error)
            }
        } else {
            res.send({ error : -1, descripcion: "Ruta '/api/products/form', metodo POST no autorizado"})
        }              
    },
    putProducts: async (req, res) => {
        if(administrador){
            const id = parseInt(req.params.id)   
            const newProd = din.productsDao.update(id,req.body)
                newProd.then( np => {                
                    if(np.length>0){                                
                    din.ProductsDaoMemory.update(id,np)                    
                    }   
                    np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
                })      
        } else {
            res.send({ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})
        }        
    },
    putProductsForm: async (req, res,next) => {
        if(administrador){
            const thumbnail = req.file
            if(thumbnail){
            req.body.thumbnail = `/assets/img/${thumbnail.filename}`  
            const id = parseInt(req.params.id)    
            const newProd = din.productsDao.update(id,req.body)
                    newProd.then( np => {  
                    if(np.length>0){
                        din.ProductsDaoMemory.update(id,np)                    
                    }   
                    np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
                    })      
            } else {
            const error = new Error('Por favor sube un archivo')
            error.httpStatusCode = 400          
            return next(error)
            }
        } else {
            res.send({ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})
        }        
    },
    deleteProducts: async (req, res) => {
        if(administrador){
            const id = parseInt(req.params.id)     
            const newProd = din.productsDao.getById(id)
                newProd.then( np => {
                    if(np===null) {
                    return res.send({error: 'producto no encontrado'})
                    }                
                    const deleteID = din.productsDao.deleteById(id)
                        deleteID.then( np => {                          
                            din.ProductsDaoMemory.deleteById(id)
                            return res.send(np)
                        })
                }) 
        } else {
            res.send({ error : -1, descripcion: "Ruta '/api/products/:id', metodo DELETE no autorizado"})
        }    
    }
}

export default controller