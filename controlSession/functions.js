import bcrypt from 'bcrypt' 
import context from '../utils/context.js'
import logger from '../logger/winston.js'
import dotenv from 'dotenv'
dotenv.config()

const checkAuth = (req,res,next) => req.isAuthenticated() ?  next() : checkToken(req,res,next)

const checkToken = (req,res,next) => {
  req.headers.authorization ? ( req.headers.authorization===process.env.AXIOTOKEN ? next() : res.redirect('/login') ) : res.redirect('/login')
}

const sessionCounter = (req) => req.session.counter ? req.session.counter++ : req.session.counter = 1

const verifyPassword = (user,password) => bcrypt.compareSync(password, user.password)

const verifySession = req => req.session.passport ? ( req.session.passport.user ? req.session.passport.user : null ) : null 

const parametersSession = (req) => {
  sessionCounter(req)   
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:${routex}, method:${req.method}}`)
  context.path=req.url
  const validador = verifySession(req)
  if(validador){
    context.loginURL.url='/logout'
    context.loginURL.title='Logout'
  } else {
    context.loginURL.url='/login'
    context.loginURL.title='Login'
  }
  return validador ? true : false 
}

const getInfoUserOrder = (req,total=0) => {
  if(req.isAuthenticated()){
    let fullname = req.user.name +' '+req.user.lastname
    if(req.body.fullname!==''){
      fullname=req.body.fullname
    } 
    return {
      user_id: req.user._id,
      email: req.user.email,
      fullname:fullname,
      address: req.user.address ? req.user.address : req.body.address,
      phone: req.user.phone ? req.user.phone : req.body.phone,
      state:'enviada',
      total:total,
    }
  } else {
    return {
      email: req.body.email,
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone,
      state:'enviada',
      total:total,
    }
  }   
}

export { checkAuth, sessionCounter, verifyPassword, parametersSession, getInfoUserOrder}