import express, { json, urlencoded} from 'express'
import ProductsDaoMemory from './../daos/products/ProductsDaoMemory.js'
import CartDaoFiles from '../daos/carts/CartDaoFiles.js'
import CartDaoMemory from './../daos/carts/CartDaoMemory.js'
const { Router } = express

const cartDaoFile = new CartDaoFiles

const routerCarrito = new Router()
      routerCarrito.use(json())
      routerCarrito.get('/api/carrito/:id/productos', (req, res) => {
        setTimeout( () => {
          const id = parseInt(req.params.id)
          if(isNaN(id) || id <= 0){
            return res.send({error: 'carrito no encontrado'})
          } 
          const result = CartDaoMemory.getById(id)
          result ? res.send(result.productos) : res.send({error: 'carrito no encontrado'})  
        },500)              
      })      
      routerCarrito.post('/api/carrito/', (req,res) => {
        const newCart = cartDaoFile.save({productos:[]})
              newCart.then( nc => {
                CartDaoMemory.save(nc)
                return res.send({id: nc.id})
              })   
      })
      routerCarrito.post('/api/carrito/:id/productos/:id_prod', (req,res) => {        
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        let addCant = req.body.cantidad ? parseInt(req.body.cantidad) : 1

        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 

        const Cart = cartDaoFile.getById(id)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                
                if(cart.productos.length>0) {                   
                  const result = cart.productos.find(cp => cp.id === id_prod )
                  if(result){                
                    result.cantidad = addCant
                    cart.productos.forEach(cp => cp.id === id_prod ? cp = result : "")                    
                    const newCart = cartDaoFile.update(id,cart)
                          newCart.then( () => {                            
                            CartDaoMemory.update(id,cart)
                            res.send(cart)
                          })
                  } else {
                    const result = ProductsDaoMemory.getById(id_prod)
                    if(result){
                      cart.productos.push({
                        ... result,
                        cantidad: addCant
                      })  
                      const newCart = cartDaoFile.update(id,cart)
                            newCart.then( () => {
                              CartDaoMemory.update(id,cart)
                              res.send(cart)
                            })                                                                           
                    } else {
                      return res.send({error: 'producto para agregar al carrito no encontrado'})
                    }                    
                  }                  
                } else {
                  const result = ProductsDaoMemory.getById(id_prod)
                  if(result){
                    cart.productos.push({
                      ... result,
                      cantidad: addCant
                    })  
                    const newCart = cartDaoFile.update(id,cart)
                          newCart.then( () => {
                            CartDaoMemory.update(id,cart)
                            res.send(cart)
                          })                                                                           
                  } else {
                    return res.send({error: 'producto para agregar al carrito no encontrado'})
                  }                                      
                }                   
              })
      })
      routerCarrito.delete('/api/carrito/:id', (req, res) => {
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const newCart = cartDaoFile.getById(id)
              newCart.then( nc => {
                if(nc===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                const deleteID = cartDaoFile.deleteById(id)
                deleteID.then( () => {
                  CartDaoMemory.deleteById(id)
                  return res.send({mensaje:`Carrito ${id} eliminado`})
                })
              }) 
      })
      routerCarrito.delete('/api/carrito/:id/productos/:id_prod', (req, res) => {
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 
        const Cart = cartDaoFile.getById(id)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }

                if(cart.productos.length>0) {                   
                  const indexOfItemInArray = cart.productos.findIndex(cp => cp.id === id_prod)
                  cart.productos.splice(indexOfItemInArray, 1)
                  const newCart = cartDaoFile.update(id,cart)
                        newCart.then( () => {
                          CartDaoMemory.update(id,cart)
                          res.send(cart)
                        })              
                } else {
                  return res.send({error: 'carrito no contiene productos'})                                     
                }                   
              })
      })

export default routerCarrito
