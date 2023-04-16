import express from 'express'
import passport from 'passport'
import controller from './sessions.controller.js'
import multer, { diskStorage } from 'multer'
import { checkAuth } from '../../controlSession/functions.js'

const { Router } = express
const storageAvatarImage = diskStorage({
      destination: (req, file, cb) => {
        cb(null,'public/assets/img/avatars')
      },
      filename: (req, file, cb) => {
        cb(null,file.originalname)
      }
  })
  const uploadAvatarImage = multer({storage:storageAvatarImage})

const routerSession = new Router()
      routerSession.get('/login', controller.getSessionLogin)   
      routerSession.post('/login', passport.authenticate('login'), controller.postSessionLogin)
      routerSession.post('/register',uploadAvatarImage.single('thumbnail'), controller.postSessionRegister)     
      routerSession.post('/logout',checkAuth,controller.postSessionLogout)   
      routerSession.put('/editProfile',checkAuth,uploadAvatarImage.single('thumbnail'),controller.putProfile)
      routerSession.post('/passwordChange',checkAuth,controller.passwordChange)   
export default routerSession