import express from 'express'
import routerProducts from '../api/products/products.router.js'
import routerCarts from '../api/carts/carts.router.js'
import routerHandlebars from '../api/handlebars/handlebars.router.js'
import routerSession from '../api/sessions/sessions.router.js'

const { Router } = express

const router = new Router()
      router.use('/api/products', routerProducts)
      router.use('/api/carrito', routerCarts)
      router.use('/session',routerSession)
      router.use(routerHandlebars)
      
export default router