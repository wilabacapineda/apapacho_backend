import express, { json, urlencoded} from 'express'
import ProductsDaoMemory from './../daos/products/ProductsDaoMemory.js'
import CartDaoFiles from '../daos/carts/CartDaoFiles.js'
import CartDaoMemory from './../daos/carts/CartDaoMemory.js'
const { Router } = express

const cartDaoFile = new CartDaoFiles

const routerCarrito = new Router()
      routerCarrito.use(json())
      routerCarrito.post('/api/carrito/', (req,res) => {
        const newCart = cartDaoFile.save({productos:[]})
              newCart.then( nc => {
                CartDaoMemory.object.push(nc)
                return res.send({id: nc.id})
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
                deleteID.then( ncc => {
                  const indexOfItemInArray = CartDaoMemory.object.findIndex(c => c.id === id)
                  CartDaoMemory.object.splice(indexOfItemInArray, 1)
                  return res.send({mensaje:`Carrito ${id} eliminado`})
                })
              }) 
      })
      routerCarrito.get('/api/carrito/:id/productos', (req, res) => {
        const id = parseInt(req.params.id)
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        CartDaoMemory.object.forEach( c => {
          if(parseInt(c.id) === id){
            return res.send(c.productos)
          }
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
                CartDaoMemory.object.forEach( c => {
                  if(parseInt(c.id) === id){
                    if(c.productos.length>0) {              
                      let prodBool = 0                                            
                      c.productos.forEach( cp => {
                        if(cp.id === id_prod){              
                          prodBool = 1 
                          cp.cantidad = addCant
                        }
                      })
                      
                      if(prodBool === 1) {                
                        const newCart = cartDaoFile.update(id,c)
                              newCart.then( nc => {
                                res.send(c)
                              })
                      } else {
                        let prodBool = 0
                        ProductsDaoMemory.object.forEach( p => {
                          if(parseInt(p.id) === id_prod){
                            prodBool = 1
                            const objNew = {
                              ... p,
                              cantidad: addCant
                            }
                            c.productos.push(objNew)                                                                             
                          }
                        })
                        if(prodBool == 1){
                          const newCart = cartDaoFile.update(id,c)
                                newCart.then( nc => {
                                  return res.send(c)
                                })
                        } else {
                          return res.send({error: 'producto para agregar al carrito no encontrado'})
                        }
                      }
                    } else {
                      let prodBool = 0
                      ProductsDaoMemory.object.forEach( p => {
                        if(parseInt(p.id) === id_prod){
                          prodBool = 1
                          const objNew = {
                            ... p,
                            cantidad: addCant
                          }
                          c.productos.push(objNew)                                                                             
                        }
                      })
                      if(prodBool == 1){
                        const newCart = cartDaoFile.update(id,c)
                              newCart.then( nc => {
                                return res.send(c)
                              })
                      } else {
                        return res.send({error: 'producto para agregar al carrito no encontrado'})
                      }
                    }   
                  }          
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
                CartDaoMemory.object.forEach( c => {
                  if(parseInt(c.id) === id){
                    if(c.productos.length>0) {              
                      let prodBool = 0                                            
                      c.productos.forEach( cp => {
                        if(cp.id === id_prod){              
                          prodBool = 1 
                        }
                      })

                      if(prodBool === 1) { 
                        const indexOfItemInArray = c.productos.findIndex(cp => cp.id === id_prod)
                        c.productos.splice(indexOfItemInArray, 1)

                        const newCart = cartDaoFile.update(id,c)
                              newCart.then( nc => {
                                res.send(c)
                              })

                      } else {
                        return res.send({error: 'El carrito no contiene el producto a eliminar'})
                      }
                    } else {
                      return res.send({error: 'carrito no contiene productos'})
                    }   
                  }          
                })
              })
      })

export default routerCarrito
