import express from 'express'
import controller from './products.controller.js'
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

const routerProducts = new Router()
      routerProducts.get('/',controller.getProducts)      
      routerProducts.get('/:id',controller.getProductsID)  
      routerProducts.post('/',checkAuth,controller.postProducts)
      routerProducts.post('/form',checkAuth,uploadProductImage.single('thumbnail'),controller.postProductsForm)   
      routerProducts.put('/:id',checkAuth,controller.putProducts)  
      routerProducts.put('/form/:id',checkAuth,uploadProductImage.single('thumbnail'),controller.putProductsForm)      
      routerProducts.delete('/:id',checkAuth,controller.deleteProducts)

export default routerProducts