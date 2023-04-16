import express from 'express'
import controller from './handlebars.controller.js'
import multer, { diskStorage } from 'multer'
import { checkAuth } from '../../controlSession/functions.js'

const { Router } = express
const storageProductImage = diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/assets/img/products/')
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
})
const uploadProductImage = multer({storage:storageProductImage})

const routerHandlebars = new Router()    
      routerHandlebars.get('/', controller.home)
      routerHandlebars.get('/tienda', controller.tienda)      
      routerHandlebars.get('/tienda/producto/:id', controller.productById)
      routerHandlebars.get('/carrito', controller.carrito)
      routerHandlebars.get('/productos', checkAuth, controller.products)
      routerHandlebars.get('/productos/:id', checkAuth, controller.editProducts)
      routerHandlebars.post('/productos', checkAuth, uploadProductImage.single('thumbnail'), controller.postProduct)  
      routerHandlebars.get('/login', controller.login)
      routerHandlebars.get('/logout', checkAuth, controller.logout)
      routerHandlebars.get('/register', controller.register)
      routerHandlebars.get('/profile', checkAuth, controller.profile)
      routerHandlebars.get('/profile/passwordChange', checkAuth, controller.passwordChange)
      routerHandlebars.get('/historial-ordenes', checkAuth, controller.historyOrders)
      routerHandlebars.get('/historial-ordenes/:id', checkAuth, controller.OrdersID)
      routerHandlebars.get("*", controller.error)     

export default routerHandlebars