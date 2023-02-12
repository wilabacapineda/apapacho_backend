import instagramFeed from '../../utils/getInstagramFeed.js'
import fetch from "node-fetch"
import dotenv from 'dotenv'
import context from '../../utils/context.js'
import { parametersSession,getCurrentUser } from '../../utils/sessionFunctions.js'
import {customCreateError, dataCreateError} from '../../utils/errors.js'
dotenv.config()

const fullhostname = (req) => {
  return req.protocol + '://' + req.get('host')
}

const controller = {
    error: async (req, res) => {
      parametersSession(req)      
      const err = "PAGE NOT FOUND"
      res.render("error",dataCreateError(err,'Error 404',404,context,req,'warn'))                                       
    },
    home: async (req, res) => {   
      try{
        parametersSession(req)
        fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {          
          if(req.isAuthenticated()){               
            const data = {
                ...context,
                productos:prod,
                instagram: instagramFeed,
                user: getCurrentUser(req)
            } 
            console.log('data',data.user.is_admin)
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
          const data = dataCreateError(err,'Homepage Error: Unreacheable Products',400,context,req)
          res.render('home',data)          
        })
      } catch (err) {        
        res.render("error",dataCreateError(err,'Homepage Error',400,context,req))
      }
    },
    tienda: async (req, res) => {  
      try{
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
          res.render("error",dataCreateError(err,'Products Page No Session',400,context,req))                      
        }    
      } catch (err) {
        res.render("error",dataCreateError(err,'Products Page Error',400,context,req))                      
      } 
    },
    editProducts: async (req,res) => {
      try {
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
          res.render("error",dataCreateError(err,'Single Product Page No Login Error',400,context,req))                      
        }        
      } catch (err) {
        res.render("error",dataCreateError(err,'Single Product Page Error',400,context,req))                      
      }
    },
    productById: async (req, res) => {
      try {
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
    }
} 

export default controller 