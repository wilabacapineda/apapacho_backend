import din from "../../model/index.js"
import { runLogger, errorLogger } from "../../logger/loggerCart.js"
import { sessionCounter, getInfoUserOrder } from "../../controlSession/functions.js"
import { emailToAdmin } from "../../mailer/sendMailTo.js"
import sendMessageWspAdmin from "../../twilio/sendMessageWsp.js"
import dotenv from 'dotenv'
dotenv.config()

const controller = {
    findCartID: async (req, res) => { 
      try{ 
        sessionCounter(req)
        runLogger(req)  
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const email = req.user ? req.user.email : 'Sin Email'
        const result = din.CartDaoMemory.getByIdCart(id,email)
              result.then( r => {
                res.send(r.products)  
              }).catch( (r) => {
                res.send({error: 'carrito no encontrado'})
              })   
      } catch(err) {
        errorLogger(req,'findCartID',err)            
      }
    },
    postCart: async (req,res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        const newCart = din.CartDao.save({products:[]})
              newCart.then( nc => {
                din.CartDaoMemory.save(nc)
                return res.send({id: nc.id})
              })   
      } catch(err) {
        errorLogger(req,'postCart',err)            
      }
    },
    postCartProduct: async (req,res) => {    
      try{ 
        sessionCounter(req) 
        runLogger(req)  
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        const cartCount = req.body.cartCount ? parseInt(req.body.cartCount) : 1
    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 
        console.log('aqui-1')
        const result = din.ProductsDaoMemory.getById(id_prod)  
              result.then( r => {
                if(r===null) {
                  return res.send({error: 'producto para agregar al carrito no encontrado'})
                }
                const email = req.user ? req.user.email : 'Sin Email'
                const newCart = din.CartDao.updateProducts(id, id_prod, r, cartCount,email)                
                      newCart.then( (c) => {  
                        console.log('aqui-4',c)
                        if(c.length<=0){
                          res.status(304)
                          res.send({error: 'Inicie sesión para agregar producto'})
                        } else {
                          din.CartDaoMemory.update(id,c)
                          res.send(c[0])
                        }                        
                      }) 
              }).catch(r => {
                return res.send({error: 'producto para agregar al carrito no encontrado'})
              })     
      } catch(err) {
        errorLogger(req,'postCartProduct',err)            
      }       
    },
    deleteCart: async (req, res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const email = req.user ? req.user.email : 'Sin Email'
        const newCart = din.CartDaoMemory.getByIdCart(id,email)
              newCart.then( nc => {
                if(nc===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(nc).length>0){
                  const deleteID = din.CartDao.deleteById(id)
                        deleteID.then( () => {
                          din.CartDaoMemory.deleteById(id)
                          return res.send({mensaje:`Carrito ${id} eliminado`})
                        })
                } else {
                  res.sendStatus(304)
                }
              }) 
      } catch(err) {
        errorLogger(req,'deleteCart',err)            
      } 
    },
    deleteCartProduct: async (req, res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        }      
        
        const email = req.user ? req.user.email : 'Sin Email'
        const Cart = din.CartDaoMemory.getByIdCart(id,email)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(cart).length>0){
                  const newCart = din.CartDao.deleteProducts(id, id_prod)
                        newCart.then( (c) => {  
                          din.CartDaoMemory.update(id,c)
                          res.send(c)
                        })                         
                        
                } else {
                  res.sendStatus(304)
                }
              }).catch(r => {
                return res.send({error: 'carrito no encontrado'})
              }) 
      } catch(err) {
        errorLogger(req,'deleteCartProduct',err)            
      } 
    },
    createOrder: async (req,res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 

        const email = req.user ? req.user.email : 'Sin Email'
        const Cart = din.CartDaoMemory.getByIdCart(id,email)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(cart).length>0){
                  const total = cart.products.reduce((acc,p) => acc + (p.cartCount*p.price),0)
                  const infoUserOrder = getInfoUserOrder(req,total)

                  const newCart = din.CartDao.update(id,infoUserOrder)
                        newCart.then( (c) => {  
                          din.CartDaoMemory.update(id,c)
                          emailToAdmin(req,c[0])
                          sendMessageWspAdmin(req,c[0])
                          //sendMessageSmsBuyer(req,c[0]) //Mientras no se tenga una cuenta de Twilio pagada no puedo enviarle mensajes al comprador via SMS
                          res.sendStatus(200)
                        })        
                } else {
                  res.sendStatus(304)
                }
              }).catch(r => {
                return res.send({error: 'carrito no encontrado'})
              }) 
      } catch(err) {
        errorLogger(req,'createOrder',err)            
      }
    },    
    findAllCartsByUserID: async (req,res) => {
      try{ 
        sessionCounter(req)
        runLogger(req)  
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'usuario no encontrado'})
        } 
        const email = req.user ? req.user.email : 'Sin Email'
        const result = din.CartDaoMemory.getCartsByUserID(id,email)
              res.send(result)        
      } catch(err) {
        errorLogger(req,'findAllCartsByUserID',err)            
      }
    }
}

export default controller