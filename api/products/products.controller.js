import din from "../../daos/index.js"
import logger from "../../utils/winston.js"
import { sessionCounter } from "../../utils/sessionFunctions.js"

const runLogger = (req) => {
    const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
    logger.info(`{route:/api/products${routex}, method:${req.method}}`)
}

const errorLogger = (req,f,err) => {
    const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
    logger.error(`{function:${f}, route:/api/products${routex}, method:${req.method}, error:${err}}`)
}

const controller = {
    getProducts: async (req,res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            res.send(din.ProductsDaoMemory.object)                  
        } catch(err) {
            errorLogger(req,'getProducts',err)            
        }        
    },
    getProductsID: async (req,res) => {
        try {
            sessionCounter(req)
            runLogger(req)
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
        } catch(err) {
            errorLogger(req,'getProductsByID',err)
        } 
    },
    postProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.isAuthenticated() && req.user.is_admin===true){
                if(!req.body.thumbnail){
                    req.body.thumbnail = `/assets/img/products/productDefault.jpg`
                } 
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
                errorLogger(req,'postProducts - metodo POST no autorizado','-1')                                              
                res.send({ error : -1, descripcion: "Ruta '/api/products', metodo POST no autorizado"})
            }   
        } catch(err) {
            errorLogger(req,'postProducts',err)
        } 
            
    },
    postProductsForm: async (req, res) => {   
        try{
            sessionCounter(req)
            runLogger(req)     
            if(req.isAuthenticated() && req.user.is_admin===true){
                if(req.file){
                    req.body.thumbnail = `/assets/img/products/${req.file.filename}` 
                } else {
                    req.body.thumbnail = `/assets/img/products/productDefault.jpg`
                }
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
                errorLogger(req,'postProductsByForm - metodo POST no autorizado','-1')              
                res.send({ error : -1, descripcion: "Ruta '/api/products/form', metodo POST no autorizado"})
            }              
        } catch(err) {
            errorLogger(req,'postProductsByForm',err)
        }
    },
    putProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.isAuthenticated() && req.user.is_admin===true){
                const id = parseInt(req.params.id) 
                if(!req.body.thumbnail){
                    req.body.thumbnail = `/assets/img/products/productDefault.jpg`
                }   
                const newProd = din.productsDao.update(id,req.body)
                    newProd.then( np => {                
                        if(np.length>0){                                
                        din.ProductsDaoMemory.update(id,np)                    
                        }   
                        np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
                    })      
            } else {
                errorLogger(req,'putProducts - metodo PUT no autorizado','-1')              
                res.send({ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})                
            }   
        } catch(err) {
            errorLogger(req,'putProducts',err)
        }    
    },
    putProductsForm: async (req, res) => {
        try {
            sessionCounter(req)
            runLogger(req)
            if(req.isAuthenticated() && req.user.is_admin===true){
                if(!req.body.thumbnail){
                    if(req.file){
                    req.body.thumbnail = `/assets/img/products/${req.file.filename}` 
                    } else {
                    req.body.thumbnail = `/assets/img/products/productDefault.jpg`
                    }
                }                
                const id = parseInt(req.params.id)    
                const newProd = din.productsDao.update(id,req.body)
                    newProd.then( np => {  
                        if(np.length>0){
                            din.ProductsDaoMemory.update(id,np)                    
                        }   
                        np.length === 0 ? res.send({error: 'producto no encontrado'}) : res.send(np)                
                    })      
                
            } else {
                errorLogger(req,'putProductsByForm - metodo PUT no autorizado','-1')              
                res.send({ error : -1, descripcion: "Ruta '/api/products/:id', metodo PUT no autorizado"})                
            }        
        } catch(err) {
            errorLogger(req,'putProductsByForm',err)
        }
    },
    deleteProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            if(req.isAuthenticated() && req.user.is_admin===true){            
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
                errorLogger(req,'deleteProducts - metodo DELETE no autorizado','-1')              
                res.send({ error : -1, descripcion: "Ruta '/api/productss/:id', metodo DELETE no autorizado"})                
            }    
        } catch(err) {
            errorLogger(req,'deleteProducts',err)
        } 
    }
}

export default controller