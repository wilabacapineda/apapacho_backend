import din from '../../daos/index.js'
import instagramFeed from '../../utils/getInstagramFeed.js'
import fetch from "node-fetch"
import dotenv from 'dotenv'
import context from '../../utils/context.js'
import { parametersSession,getCurrentUser } from '../../utils/sessionFunctions.js'
import {customCreateError, dataCreateError} from '../../utils/errors.js'
import { sessionCounter } from '../../utils/sessionFunctions.js'
import d from 'D'
dotenv.config()

const fullhostname = (req) => {
  return req.protocol + '://' + req.get('host')
}

const controller = {
    error: async (req, res) => {
      try{
        sessionCounter(req)
        parametersSession(req)      
        const err = "PAGE NOT FOUND"
        res.render("error",dataCreateError(err,'Error 404',404,context,req,'warn'))                                       
      } catch(err){
        dataCreateError(err,'error Page',400,context,req)
      }      
    },
    home: async (req, res) => {   
      try{
        sessionCounter(req)
        parametersSession(req)
        fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {          
          if(req.isAuthenticated()){               
            const data = {
                ...context,
                productos:prod,
                instagram: instagramFeed,
                user: getCurrentUser(req)
            } 
            res.render('home',data)                  
          } else {
            const data = {
                ...context,
                productos:prod,
                instagram: instagramFeed
            }
            res.render('home',data)
          }
        }).catch( err => {                    
          res.render('home',dataCreateError(err,'Homepage Error: Unreacheable Products',400,context,req))          
        })
      } catch (err) {        
        res.render("error",dataCreateError(err,'Homepage Error',400,context,req))
      }
    },
    tienda: async (req, res) => {  
      try{
        sessionCounter(req)
        parametersSession(req)
        fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {
          if(req.isAuthenticated()){
            const data = {
                ...context,
                productos:prod,                    
                user: getCurrentUser(req)
            } 
            res.render("tienda",data)                              
          } else {
            const data = {
              ...context,
              productos:prod
            }
            res.render("tienda",data)
          }
        }).catch( err => {
          res.render("error",dataCreateError(err,'Store Page Error: Unreacheable Store',523,context,req))                      
        })
      } catch (err) {
        res.render("error",dataCreateError(err,'Store Page Error',400,context,req))                      
      }       
    },
    carrito: async (req,res) => {
      try{
        sessionCounter(req)
        parametersSession(req)   
        if(req.isAuthenticated()){
          const data = {
              ...context,
              user: getCurrentUser(req)
          } 
          res.render("carrito",data)          
        } else {
          const data = {
            ...context,
          }
          res.render("carrito",data)
        }    
      } catch (err) {
        res.render("error",dataCreateError(err,'Cart Page Error',400,context,req))                      
      }
    },
    carritoById: async (req,res) => {

    },
    products: async (req, res) => {  
      try {
        sessionCounter(req)
        parametersSession(req)   
        if(req.isAuthenticated()){
          fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {
            if(prod.length>0){
              const data = {
                  ...context,
                  productos:prod,
                  user: getCurrentUser(req)
              } 
              res.render("productos",data)                            
            } else {
              const data = {
                  ...context,
                  user: getCurrentUser(req)
              } 
              res.render("productos",data)
            }        
          }).catch( err => {
            res.render("error",dataCreateError(err,'Products Page Error: Unreacheable Products',523,context,req))                      
          })
        } else {
          res.redirect('/login')          
        }    
      } catch (err) {
        res.render("error",dataCreateError(err,'Products Page Error',400,context,req))                      
      } 
    },
    editProducts: async (req,res) => {
      try {
        sessionCounter(req)
        parametersSession(req)
        if(req.isAuthenticated() && req.user.is_admin===true){
          const id = parseInt(req.params.id)
          if(isNaN(id) || id <= 0){          
            res.render("error",dataCreateError(err,"Imposible Product",404,context,req,'warn'))                                  
          }    
          fetch(`${fullhostname(req)}/api/products/${id}`).then( prod => prod.json()).then( prod => {          
            if(prod.id){
              const data = {
                  ...context,
                  productos:prod,
                  user: getCurrentUser(req)
              } 
              res.render("editProduct",data)                          
            } else {
              res.render("error",dataCreateError(err,"Non-existent Product",404,context,req,'warn'))                                  
            }          
          }).catch( err => {
            res.render("error",dataCreateError(err,"Single Product Page Error: Non-existent Product",404,context,req,'warn'))                                                                  
          })
        } else {
          res.redirect('/login')          
        }        
      } catch (err) {
        res.render("error",dataCreateError(err,'Single Product Page Error',400,context,req))                      
      }
    },
    productById: async (req, res) => {
      try {
        sessionCounter(req)
        parametersSession(req)        
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){          
          res.render("error",dataCreateError(err,"Imposible Product",404,context,req,'warn'))                                  
        }               
        fetch(`${fullhostname(req)}/api/products/${id}`).then(prod => prod.json()).then( prod => {          
          if(prod.id){
            prod.price = prod.price.toLocaleString()
            if(req.isAuthenticated()){
              const data = {
                  ...context,
                  productos:prod,
                  user: getCurrentUser(req)
              } 
              res.render("producto",data)
            } else {
              const data = {
                ...context,
                productos:prod
              }
              res.render("producto",data)
            }
          } else {
            res.render("error",dataCreateError(err,"Non-existent Product",404,context,req,'warn'))                                  
          }          
        }).catch( err => {
          res.render("error",dataCreateError(err,"Single Product Page Error: Non-existent Product",404,context,req,'warn'))                                                                  
        })
      } catch (err) {
        res.render("error",dataCreateError(err,'Single Product Page Error',400,context,req))                      
      }
    },
    postProduct: async (req, res,next) => {        
        try { 
          sessionCounter(req)    
          parametersSession(req)       
          if(req.isAuthenticated() && req.user.is_admin===true){                
              if(req.file){
                req.body.file=req.file
                fetch(`${fullhostname(req)}/api/products/form`,{
                  method: 'POST',
                  body: JSON.stringify(req.body),
                  headers: {
                    'Content-Type': 'application/json'
                  }, 
                }).then(prod => prod.json()).then( prod => {
                  return res.json({
                    success: true,
                    message: "Cargado con Exito"                          
                  })
                }).catch( err => {                                         
                  return next(customCreateError(err,'Product Create Error',400,'',req))                    
                })
              } else {                  
                err='Por favor sube un archivo'   
                return next(customCreateError(err,'POST method without file',400,'',req))
              }
          } else {
              err = -1
              return next(customCreateError(err,'unauthorized POST method',401,'',req))                
          }     
        } catch (err) {                 
            return next(customCreateError(err,'Post Product Error',400,'',req))
        }
    },
    login: async (req, res) => { 
      try{
        sessionCounter(req)
        parametersSession(req)    
        if(req.isAuthenticated()){
          const data = {
              ...context,
              user: getCurrentUser(req)
          } 
          res.render("login",data)          
        } else {
          const data = {
            ...context,
            name: false
          }
          res.render("login",data)
        }      
      } catch (err) {
        res.render("error",dataCreateError(err,'Login Page Error',400,context,req))                      
      }
    },
    logout: async (req, res) => {                  
      try {
        sessionCounter(req)
        parametersSession(req)   
        if(req.isAuthenticated()){
            const data = {
                ...context,
                name: req.user.name,
                user: getCurrentUser(req)
            } 
            res.render("logout",data)          
        } else {
          const data = {
            ...context,
            name: false
          }
          res.render("logout",data)
        } 
      } catch (err) {
        res.render("error",dataCreateError(err,'Logout Page Error',400,context,req))                      
      }
    },
    register: async (req, res) => {   
      try{   
        sessionCounter(req)
        parametersSession(req)  
        if(req.isAuthenticated()){
            const data = {
                ...context,
                user: getCurrentUser(req)
            } 
            res.render("register",data)          
        } else {
          const data = {
            ...context,
            name: false
          }
          res.render("register",data)
        }
      } catch (err) {
        res.render("error",dataCreateError(err,'Register Page Error',400,context,req))                      
      }
    },
    profile: async(req,res) => {
      try {
        sessionCounter(req)
        parametersSession(req)
        if(req.isAuthenticated()){          
          const data = {
              ...context,
              user: getCurrentUser(req)
          } 
          res.render("profile",data)
        } else {
          res.redirect('/login')
        }
      } catch (err) {
        res.render("error",dataCreateError(err,'Profile Page Error',400,context,req))                      
      }
    },
    historyOrders: async(req,res) => {
      try{
        sessionCounter(req)
        parametersSession(req)  
        const id = req.user._id   
        const email = req.user.email 
        const result = din.CartDaoMemory.getCartsByUserID(id,email)
              result.then( c => {
                const ordenes = c.map( p => {
                  return({
                    fullname: p.fullname,
                    address: p.address,
                    phone: p.phone,
                    id: p.id,
                    timestamp: p.timestamp,
                    dateUpdate: new Date(p.dateUpdate).toLocaleDateString(),
                    state: p.state,
                    total: p.total,
                    email: p.email,
                    user_id: p.user_id
                  })
                })
                const data = {
                  ...context,
                  ordenes:ordenes,
                  user: getCurrentUser(req)
                } 
                res.render("historyOrders",data)
              })
      } catch (err) {
        res.render("error",dataCreateError(err,'History Orders Page Error',400,context,req))                      
      }
    },
    OrdersID: async(req,res) => {
      try{
        sessionCounter(req)
        parametersSession(req)  
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){          
          res.render("error",dataCreateError(err,"Imposible Product",404,context,req,'warn'))                                  
        }            
        const _id = req.user._id   
        const email = req.user.email 
        const result = din.CartDaoMemory.getOrderByID(id,_id,email)
              result.then( c => {
                const orden = {
                  fullname: c.fullname,
                  address: c.address,
                  phone: c.phone,
                  id: c.id,
                  timestamp: new Date(c.timestamp).toLocaleDateString(),
                  dateUpdate: new Date(c.dateUpdate).toLocaleDateString(),
                  state: c.state,
                  total: c.total,
                  email: c.email,
                  user_id: c.user_id
                }
                const productos = c.products.map(p => {
                  return({
                    id: p.id,
                    timestamp: new Date(p.timestamp).toLocaleDateString(),
                    dateUpdate: new Date(p.dateUpdate).toLocaleDateString(),
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    cartCount: p.cartCount,
                    thumbnail: p.thumbnail,
                    subtotal: (p.cartCount*p.price).toLocaleString()
                  })
                })
                const data = {
                  ...context,
                  orden:orden,
                  productos:productos,
                  user: getCurrentUser(req)
                } 
                res.render("OrderID",data)
              })
      } catch (err) {
        res.render("error",dataCreateError(err,'History Orders Page Error',400,context,req))                      
      }
    }
} 

export default controller 