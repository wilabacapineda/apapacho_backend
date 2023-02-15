import din from "../../daos/index.js"
import logger from "../../utils/winston.js"
import { sessionCounter } from "../../utils/sessionFunctions.js"
import sendMail from "../../mailer/mailer.js"
import client from "../../twilio/clientWsp.js"
import dotenv from 'dotenv'
dotenv.config()

const runLogger = (req) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:/api/carrito${routex}, method:${req.method}}`)
}

const errorLogger = (req,f,err) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.error(`{function:${f}, route:/api/carrito${routex}, method:${req.method}, error:${err}}`)
}

const fullhostname = (req) => {
  return req.protocol + '://' + req.get('host')
}

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
        const newCart = din.cartDao.save({products:[]})
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
        const result = din.ProductsDaoMemory.getById(id_prod)  
              result.then( r => {
                if(r===null) {
                  return res.send({error: 'producto para agregar al carrito no encontrado'})
                }
                const email = req.user ? req.user.email : 'Sin Email'
                const newCart = din.cartDao.updateProducts(id, id_prod, r, cartCount,email)                
                      newCart.then( (c) => {  
                        if(c.length<=0){
                          res.status(304)
                          res.send({error: 'Inicie sesión para agregar producto'})
                        } else {
                          din.CartDaoMemory.update(id,c)
                          //console.log('din:',din.CartDaoMemory.object)
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
                  const deleteID = din.cartDao.deleteById(id)
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
                  const newCart = din.cartDao.deleteProducts(id, id_prod)
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
                  console.log(total)
                  let infoUserOrder
                  if(req.isAuthenticated()){
                    let fullname = req.user.name +' '+req.lastname
                    if(req.body.fullname!==''){
                      fullname=req.body.fullname
                    } 
                    infoUserOrder = {
                      user_id: req.user._id,
                      email: req.user.email,
                      fullname:fullname,
                      address: req.user.address ? req.user.address : req.body.address,
                      phone: req.user.phone ? req.user.phone : req.body.phone,
                      state:'enviada',
                      total:total,
                    }
                  } else {
                    infoUserOrder = {
                      email: req.body.email,
                      fullname: req.body.fullname,
                      address: req.body.address,
                      phone: req.body.phone,
                      state:'enviada',
                      total:total,
                    }
                  }                  
                  const newCart = din.cartDao.update(id,infoUserOrder)
                        newCart.then( (c) => {  
                          din.CartDaoMemory.update(id,c)
                          console.log('cartC',c[0])
                          const productsCart = c[0].products.map( (p) => {
                              return(`<tr>
                                        <td>
                                          <a href="${fullhostname(req)}/tienda/producto/${p.id}">
                                              <img src="${fullhostname(req)+p.thumbnail}" style="width:150px" width="150">
                                          </a>
                                        </td>
                                        <td><a href="${fullhostname(req)}/tienda/producto/${p.id}">${p.title}</a></td>
                                        <td>${p.price}</td>
                                        <td>${p.cartCount}</td>                                        
                                        <td>$${(p.price*p.cartCount).toLocaleString()}</td>                                            
                                      </tr>`)      
                          }).join(" ")
                          const emailBody = `<div>
                                                <p>Se ha realizado un nuevo pedido en Apapacho.</p>
                                                <div>
                                                  <span>Datos de Orden ID-${c[0].id}</span>
                                                  <ul>
                                                    <li><strong>Email: </strong>${c[0].email}</li>
                                                    <li><strong>Name: </strong>${c[0].fullname}</li>
                                                    <li><strong>Address: </strong>${c[0].address}</li>
                                                    <li><strong>Phone: </strong>${c[0].phone}</li>
                                                    <li><strong>Date Created: </strong>${c[0].dateUpdate}</li>
                                                  </ul>
                                                </div>
                                                <br/>
                                                <table border="1" style="text-align: center;">
                                                  <thead>
                                                    <th>Imagen</th>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad</th>
                                                    <th>Subtotal</th>
                                                  </thead>
                                                  <tbody>
                                                    ${productsCart}
                                                  </tbody>
                                                  <tfoot>
                                                    <td colspan="4"><strong>Total</strong></td>
                                                    <td>${c[0].total}</td>
                                                  </tfoot>
                                                </table>
                                              </div>`
                          const subject = `Nuevo Pedido de ${c[0].fullname} - ${c[0].email} en Apapacho`
                          sendMail({
                              to: c[0].email,
                              subject: subject,
                              text: '',
                              html:emailBody,    
                          }).then( info => {
                            runLogger(req,`sendMail from ${info.envelope.from} to ${info.envelope.to} response -> ${info.response}`)
                          }).catch( err => {
                            errorLogger(req,'Send Mail Rejected',`Order ID-${c[0].id} sent by usermail ${c[0].email} but sendMail error response -> ${err}`)
                          })                          
                          
                          const options = {
                              body:subject,
                              from:`whatsapp:${process.env.TWILIO_PHONE}`,
                              to:`whatsapp:${c[0].phone}`
                          }

                          try{
                              client.messages.create(options).then(message => {
                                runLogger(req,`Twilio Wsp send Order ID-${c[0].id} successful to ${c[0].phone}`)
                              })
                          } catch(err){
                            errorLogger(req,`Twilio Wsp send Order ID-${c[0].id} Error to ${c[0].phone}`,err)
                          }

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
    }
}

export default controller