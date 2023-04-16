import calculate from './sessions.calculate.js'
import { sessionCounter } from '../../controlSession/functions.js'
import { runLogger, errorLogger } from '../../logger/loggerSessions.js'

const controller = {
    getSessionLogin: async (req, res) => {      
      try {   
        sessionCounter(req)                
        runLogger(req) 
        calculate.getSessionLogin(req,res)        
      } catch(err) {
        errorLogger(req,'getSessionLogin',err)            
      }
    },
    postSessionLogin: async (req, res, next) => {  
      try {                   
        sessionCounter(req)                  
        runLogger(req) 
        res.sendStatus(200)
      } catch (err) {                 
        errorLogger(req,'postSessionLogin',err)            
      }      
    },
    postSessionRegister: async (req, res, next) => {       
      try {
        if(!req.isAuthenticated()) {
          sessionCounter(req)                 
          runLogger(req) 
          calculate.postSessionRegister(req,res) 
        } else {
          err = -1
          return next(errorLogger(req,'unauthorized POST method on Register - User already login',err))          
        }           
      } catch (err) {      
        return next(errorLogger(req,'postSessionLogin',err))
      }
    },
    postSessionLogout: async (req,res) => {
      try {
        sessionCounter(req)
        runLogger(req) 
        calculate.postSessionLogout(req,res)
      } catch (err) {  
        errorLogger(req,'postSessionLogout',err)                       
      }
    },
    putProfile: async (req,res,next) => {
      try {
          sessionCounter(req)                 
          runLogger(req) 
          calculate.putProfile(req,res)     
      } catch (err) {
        return next(errorLogger(req,'putProfile',err))
      }
    },
    passwordChange: async (req,res,next) => {
      try {
        console.log('jol',req.body)
        if(req.isAuthenticated()) {
          sessionCounter(req)                 
          runLogger(req) 
          calculate.passwordChange(req,res) 
        } else {
          let err = -1
          return next(errorLogger(req,'unauthorized POST method on passwordChange - User already login',err))          
        }           
      } catch (err) {      
        return next(errorLogger(req,'passwordChange',err))
      }
    }
} 

export default controller