import express from 'express'
import controller from './carts.controller.js'

const { Router } = express
const routerCarts = new Router() 
  routerCarts.get('/:id/productos',controller.findCartID)      
  routerCarts.post('/',controller.postCart)
  routerCarts.post('/:id/productos/:id_prod', controller.postCartProduct)  
  routerCarts.delete('/:id', controller.deleteCart)
  routerCarts.delete('/:id/productos/:id_prod',controller.deleteCartProduct)  

export default routerCarts