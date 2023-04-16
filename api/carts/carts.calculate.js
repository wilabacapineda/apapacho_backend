import { CartDaoMemory, CartDao, ProductsDaoMemory} from "../../model/index.js"
import { getInfoUserOrder } from "../../controlSession/functions.js"
import { emailToAdmin } from "../../mailer/sendMailTo.js"
import sendMessageWspAdmin from "../../twilio/sendMessageWsp.js"

const calculate = {
    sendProducts: (res, prod) => {
        res.send(prod)  
    },
    findCart:(req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'carrito no encontrado'})                   
        
        const email = req.user ? req.user.email : 'Sin Email'
        const result = CartDaoMemory.getByIdCart(id,email)
              result.then( r => {
                res.send(r.products)  
              }).catch( (r) => {
                res.send({error: 'carrito no encontrado'})
              })   
    },
    postCart:(req,res) => {
        const newCart = CartDao.save({products:[]})
              newCart.then( nc => {
                CartDaoMemory.save(nc)
                return res.send({id: nc.id})
              }).catch( (r) => {
                res.send({error: 'problemas al guardar carrito'})
              }) 
    },
    postCartProduct:(req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'carrito no encontrado'})                   
        const id_prod = calculate.verifyIdIsNumberNatural(req,'id_prod') ? parseInt(req.params.id_prod) : calculate.sendError(res,{error: 'producto para agregar al carrito no encontrado'})                   
        const cartCount = req.body.cartCount ? parseInt(req.body.cartCount) : 1
        const result = ProductsDaoMemory.getById(id_prod)  
              result.then( r => {
                if(r===null) {
                  return res.send({error: 'producto para agregar al carrito no encontrado'})
                }                
                const email = req.user ? req.user.email : 'Sin Email'
                const newCart = CartDao.updateProducts(id, id_prod, r, cartCount,email)                
                      newCart.then( (c) => {  
                        if(c.length<=0){
                          res.status(304)
                          res.send({error: 'Inicie sesión para agregar producto'})
                        } else {
                          CartDaoMemory.update(id,c)                          
                          res.send(c[0])
                        }                        
                      }) 
              }).catch(r => {
                return res.send({error: 'producto para agregar al carrito no encontrado'})
              })     
    },
    deleteCart: (req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'carrito no encontrado'})                   
        const email = req.user ? req.user.email : 'Sin Email'
        const newCart = CartDaoMemory.getByIdCart(id,email)
              newCart.then( nc => {
                if(nc===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(nc).length>0){
                  const deleteID = CartDao.deleteById(id)
                        deleteID.then( () => {
                          CartDaoMemory.deleteById(id)
                          return res.send({mensaje:`Carrito ${id} eliminado`})
                        })
                } else {
                  res.sendStatus(304)
                }
              }) 
    },
    deleteCartProduct:(req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'carrito no encontrado'})                   
        const id_prod = calculate.verifyIdIsNumberNatural(req,'id_prod') ? parseInt(req.params.id_prod) : calculate.sendError(res,{error: 'producto para agregar al carrito no encontrado'})                           
        const email = req.user ? req.user.email : 'Sin Email'
        const Cart = CartDaoMemory.getByIdCart(id,email)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(cart).length>0){
                  const newCart = CartDao.deleteProducts(id, id_prod)
                        newCart.then( (c) => {  
                          CartDaoMemory.update(id,c)
                          res.send(c)
                        })                         
                        
                } else {
                  res.sendStatus(304)
                }
              }).catch(r => {
                return res.send({error: 'carrito no encontrado'})
              }) 
    },
    createOrder:(req,res) => {
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'carrito no encontrado'})                   
        const email = req.user ? req.user.email : 'Sin Email'
        const Cart = CartDaoMemory.getByIdCart(id,email)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                if(Object.keys(cart).length>0){
                  const total = cart.products.reduce((acc,p) => acc + (p.cartCount*p.price),0)
                  const infoUserOrder = getInfoUserOrder(req,total)

                  const newCart = CartDao.update(id,infoUserOrder)
                        newCart.then( (c) => {  
                          CartDaoMemory.update(id,c)
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
    },
    findAllCartsByUserID:(req,res)=>{
        const id = calculate.verifyIdIsNumberNatural(req) ? parseInt(req.params.id) : calculate.sendError(res,{error: 'usuario no encontrado'})                   
        const email = req.user ? req.user.email : 'Sin Email'
        const result = CartDaoMemory.getCartsByUserID(id,email)
              res.send(result)   
    },
    verifyIdIsNumberNatural: (req,idname='id') => {
        const id = parseInt(req.params[`${idname}`])                  
        if(isNaN(id) || id <= 0){          
            return false
        }
        return id
    },
}

export default calculate