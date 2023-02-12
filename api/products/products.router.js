import express from 'express'
import controller from './products.controller.js'
import multer, { diskStorage } from 'multer'

const { Router } = express
const storageProductImage = diskStorage({
    destination: (req, file, cb) => {
      cb(null,'public/assets/img/')
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname)
    }
})
const uploadProductImage = multer({storage:storageProductImage})

const routerProducts = new Router()
      routerProducts.get('/',controller.getProducts)      
      routerProducts.get('/:id',controller.getProductsID)  
      routerProducts.post('/',controller.postProducts)
      routerProducts.post('/form',uploadProductImage.single('thumbnail'),controller.postProductsForm)   
      routerProducts.put('/:id',controller.putProducts)  
      routerProducts.put('/form/:id',uploadProductImage.single('thumbnail'),controller.putProductsForm)      
      routerProducts.delete('/:id',controller.deleteProducts)

export default routerProducts