import express from 'express'
import passport from 'passport'
import controller from './sessions.controller.js'

const { Router } = express
const routerSession = new Router()
      routerSession.get('/login', controller.getSessionLogin)   
      routerSession.post('/login', passport.authenticate('login'), controller.postSessionLogin)
      routerSession.post('/register', controller.postSessionRegister)     
      routerSession.post('/logout', controller.postSessionLogout)      
export default routerSession