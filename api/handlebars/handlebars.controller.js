import users from '../../daos/loadUsers.js'
import instagramFeed from '../../utils/getInstagramFeed.js'
//import { mensajes, users } from '../../daos/load.js'
import fetch from "node-fetch"
import dotenv from 'dotenv'
//import { denormalizar } from '../../utils/normalizar.js'
import context from '../../utils/context.js'
import { sessionCounter, verifySession } from '../../utils/sessionFunctions.js'
import {customCreateError, dataCreateError} from '../../utils/errors.js'
import logger from '../../utils/winston.js'
dotenv.config()

const administrador = true 

const fContextAdd = (req) => {
  sessionCounter(req)   
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:${routex}, method:${req.method}}`)
  context.path=req.url
  const validador = verifySession(req)
  validador ? context.loginURL = { url:'/logout', title:'Logout'} : context.loginURL = { url:'/login', title:'Login' }
  return validador
}

const fullhostname = (req) => {
  return req.protocol + '://' + req.get('host')
}

const controller = {
    error: async (req, res) => {
      const validador = fContextAdd(req)      
      const err = "PAGE NOT FOUND"
      res.render("error",dataCreateError(err,'Error 404',404,context,req,'warn'))                                       
    },
    home: async (req, res) => {   
      try{
        const validador = fContextAdd(req)
        //const mensajesDeN = denormalizar(mensajes)           
        const mensajesDeN = ''           
        fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {          
          if(validador){               
            const user = users.getBy_Id(req.session.passport.user)
                  user.then( r => {
                    delete r.password
                    const data = {
                        ...context,
                        productos:prod,
                        instagram: instagramFeed,
                        mensajes:mensajesDeN,                        
                        user: {
                            name: r.name,
                            lastname: r.lastname,
                            email: r.email,
                            age: r.age
                        }
                    } 
                    res.render('home',data)
                  })
          } else {
              const data = {
                  ...context,
                  productos:prod,
                  instagram: instagramFeed,
                  mensajes:mensajesDeN,
              }
              res.render('home',data)
          }
        }).catch( err => {                    
          const data = dataCreateError(err,'Homepage Error: Unreacheable Products',400,context,req)
                data.mensajes=mensajesDeN          
          res.render('home',data)          
        })
      } catch (err) {        
        res.render("error",dataCreateError(err,'Homepage Error',400,context,req))
      }
    },
    tienda: async (req, res) => {  
      try{
        const validador = fContextAdd(req)
        fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {
          if(validador){
            const user = users.getBy_Id(req.session.passport.user)
                  user.then( r => {
                    delete r.password
                    const data = {
                        ...context,
                        productos:prod,                    
                        user: {
                            name: r.name,
                            lastname: r.lastname,
                            email: r.email,
                            age: r.age
                        }
                    } 
                    res.render("tienda",data)
                  })            
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
        const validador = fContextAdd(req)   
        if(validador){
          const user = users.getBy_Id(req.session.passport.user)
          user.then( r => {
            delete r.password
            const data = {
                ...context,
                user: {
                    name: r.name,
                    lastname: r.lastname,
                    email: r.email,
                    age: r.age
                }
            } 
            res.render("carrito",data)
          }) 
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
        const validador = fContextAdd(req)   
        if(validador){
          fetch(`${fullhostname(req)}/api/products/`).then(prod => prod.json()).then( prod => {
            if(prod.length>0){
              const user = users.getBy_Id(req.session.passport.user)
              user.then( r => {
                delete r.password
                const data = {
                    ...context,
                    productos:prod,
                    user: {
                        name: r.name,
                        lastname: r.lastname,
                        email: r.email,
                        age: r.age
                    }
                } 
                res.render("productos",data)
              })               
            } else {
              const user = users.getBy_Id(req.session.passport.user)
              user.then( r => {
                delete r.password
                const data = {
                    ...context,
                    user: {
                        name: r.name,
                        lastname: r.lastname,
                        email: r.email,
                        age: r.age
                    }
                } 
                res.render("productos",data)
              })                          
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
        const validador = fContextAdd(req)
        if(validador){
          const id = parseInt(req.params.id)
          if(isNaN(id) || id <= 0){          
            res.render("error",dataCreateError(err,"Imposible Product",404,context,req,'warn'))                                  
          }    
          fetch(`${fullhostname(req)}/api/products/${id}`).then( prod => prod.json()).then( prod => {          
            if(prod.id){
              const user = users.getBy_Id(req.session.passport.user)
              user.then( r => {
                delete r.password
                const data = {
                    ...context,
                    productos:prod,
                    user: {
                        name: r.name,
                        lastname: r.lastname,
                        email: r.email,
                        age: r.age
                    }
                } 
                res.render("editProduct",data)
              })              
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
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){          
          res.render("error",dataCreateError(err,"Imposible Product",404,context,req,'warn'))                                  
        }               
        const validador = fContextAdd(req)        
        fetch(`${fullhostname(req)}/api/products/${id}`).then(prod => prod.json()).then( prod => {          
          if(prod.id){
            prod.price = prod.price.toLocaleString()
            if(validador){
              const user = users.getBy_Id(req.session.passport.user)
              user.then( r => {
                delete r.password
                const data = {
                    ...context,
                    productos:prod,
                    user: {
                        name: r.name,
                        lastname: r.lastname,
                        email: r.email,
                        age: r.age
                    }
                } 
                res.render("producto",data)
              })
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
            const validador = fContextAdd(req)       
            if(validador){                
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
        const validador = fContextAdd(req)    
        if(validador){
          const user = users.getBy_Id(req.session.passport.user)
          user.then( r => {
            delete r.password
            const data = {
                ...context,
                name: req.isAuthenticated() ? req.user.name : false,
                user: {
                    name: r.name,
                    lastname: r.lastname,
                    email: r.email,
                    age: r.age
                }
            } 
            res.render("login",data)
          })
        } else {
          const data = {
            ...context,
            name: req.isAuthenticated() ? req.user.name : false
          }
          res.render("login",data)
        }      
      } catch (err) {
        res.render("error",dataCreateError(err,'Login Page Error',400,context,req))                      
      }
    },
    logout: async (req, res) => {                  
      try {
        const validador = fContextAdd(req)   
        if(validador){
          const user = users.getBy_Id(req.session.passport.user)
          user.then( r => {
            delete r.password
            const data = {
                ...context,
                name: req.isAuthenticated() ? req.user.name : false,
                user: {
                    name: r.name,
                    lastname: r.lastname,
                    email: r.email,
                    age: r.age
                }
            } 
            res.render("logout",data)
          })
        } else {
          const data = {
            ...context,
            name: req.isAuthenticated() ? req.user.name : false
          }
          res.render("logout",data)
        } 
      } catch (err) {
        res.render("error",dataCreateError(err,'Logout Page Error',400,context,req))                      
      }
    },
    register: async (req, res) => {   
      try{   
        const validador = fContextAdd(req)  
        if(validador){
          const user = users.getBy_Id(req.session.passport.user)
          user.then( r => {
            delete r.password
            const data = {
                ...context,
                name: req.isAuthenticated() ? req.user.name : false,
                user: {
                    name: r.name,
                    lastname: r.lastname,
                    email: r.email,
                    age: r.age
                }
            } 
            res.render("register",data)
          })
        } else {
          const data = {
            ...context,
            name: req.isAuthenticated() ? req.user.name : false
          }
          res.render("register",data)
        }          
        
      } catch (err) {
        res.render("error",dataCreateError(err,'Register Page Error',400,context,req))                      
      }
    }
} 

export default controller 