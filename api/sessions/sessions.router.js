import express from 'express'
import passport from 'passport'
import controller from './sessions.controller.js'
import multer, { diskStorage } from 'multer'

const { Router } = express
const storageProductImage = diskStorage({
      destination: (req, file, cb) => {
        cb(null,'public/assets/img/avatars')
      },
      filename: (req, file, cb) => {
        cb(null,file.originalname)
      }
  })
  const uploadProductImage = multer({storage:storageProductImage})

const routerSession = new Router()
      routerSession.get('/login', controller.getSessionLogin)   
      routerSession.post('/login', passport.authenticate('login'), controller.postSessionLogin)
      routerSession.post('/register',uploadProductImage.single('thumbnail'), controller.postSessionRegister)     
      routerSession.post('/logout', controller.postSessionLogout)      
export default routerSession