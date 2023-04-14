import din from '../../model/index.js'
import calculate from './sessions.calculate.js'
import { sessionCounter } from '../../controlSession/functions.js'
import { runLogger, errorLogger } from '../../logger/loggerSessions.js'

const controller = {
    getSessionLogin: async (req, res) => {      
      try {   
        sessionCounter(req)                
        runLogger(req) 
        res.status(200).json({name: calculate.getSessionName(req), counter: req.session.counter})                    
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
          req.body.avatar = req.file ? `/assets/img/avatars/${req.file.filename}` : `/assets/img/avatars/avatar.jpg`
          const findEmail = din.users.getByEmail(req.body.email)
                findEmail.then( r => {
                  if(r === null) {                    
                    req.body.age = parseInt(req.body.age)
                    req.body.password = calculate.hashPassword(req.body.password)
                    const newUser = din.users.saveUser(req.body)  
                          newUser.then( (u) => {
                            calculate.sendRegisterMail(req,u)
                            return res.json({
                                success: true,
                                message: "Registro exitoso!"                          
                            })
                          })                    
                  } else {
                    res.sendStatus(302)
                  }
                }).catch( r => {
                  res.send({error: 'error al registrar usuario'})
                }) 
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
        req.session.destroy(err => {
            if(err){
                res.json({error: 'olvidar', body:err})
            } else {                
                res.json({name:calculate.getSessionName(req)})
            }
        }) 
      } catch (err) {  
        errorLogger(req,'postSessionLogout',err)                       
      }
    },
    putProfile: async (req,res,next) => {
      try {
          sessionCounter(req)                 
          runLogger(req) 
          !req.body.avatar ? req.body.avatar = req.file ? `/assets/img/avatars/${req.file.filename}` : req.body.avatar = `/assets/img/avatars/avatar.jpg` : ''
          const findEmail = din.users.getByEmail(req.body.email)
                findEmail.then( r => {
                  if(r === null) {                    
                    res.sendStatus(302)                   
                  } else {                  
                    req.body.age = parseInt(req.body.age)
                    const newUser = users.updateUser(req.body)  
                          newUser.then( (nu) => {      
                            nu.length === 0 ? res.send({error: 'usuario no encontrado'}) : res.json({ success: true, message: "Registro exitoso!"})                        
                          }) 
                  }               
                }).catch( r => {
                  res.send({error: 'error al registrar usuario'})
                })        
      } catch (err) {
        return next(errorLogger(req,'putProfile',err))
      }
    }
} 

export default controller