import users from '../../daos/loadUsers.js'
import { sessionCounter, saltRounds, getSessionName, hashPassword } from '../../utils/sessionFunctions.js'
import logger from '../../utils/winston.js'

const runLogger = (req) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:/session${routex}, method:${req.method}}`)
}

const errorLogger = (req,f,err) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.error(`{function:${f}, route:/session${routex}, method:${req.method}, error:${err}}`)
}

const controller = {
    getSessionLogin: async (req, res) => {      
      try {   
        sessionCounter(req)                
        runLogger(req) 
        res.status(200).json({name: getSessionName(req), counter: req.session.counter})                    
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
          if(req.file){
            req.body.avatar = `/assets/img/avatars/${req.file.filename}` 
          } else {
            req.body.avatar = `/assets/img/avatars/avatar.jpg`
          }        
          const findEmail = users.getByEmail(req.body.email)
                findEmail.then( r => {
                  if(r === null) {                    
                    req.body.age = parseInt(req.body.age)
                    req.body.password = hashPassword(req.body.password, saltRounds)
                    const newUser = users.saveUser(req.body)  
                          newUser.then( () => {                      
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
        if(req.isAuthenticated()){
          sessionCounter(req)
          runLogger(req)
          const aux = req.isAuthenticated() ? req.user.name : false
          req.session.destroy(err => {
              if(err){
                  res.json({error: 'olvidar', body:err})
              } else {                
                  res.json({name:aux})
              }
          })
        } else {
          err = -1
          errorLogger(req,'unauthorized POST method on Logout',err)                                                     
        }
      } catch (err) {  
        errorLogger(req,'postSessionLogout',err)                       
      }
    },
    putProfile: async (req,res,next) => {
      try {
        if(req.isAuthenticated()){               
          sessionCounter(req)                 
          runLogger(req)
          if(!req.body.avatar){
            if(req.file){
              req.body.avatar = `/assets/img/avatars/${req.file.filename}` 
            } else {
              req.body.avatar = `/assets/img/avatars/avatar.jpg`
            }
          }          
          const findEmail = users.getByEmail(req.body.email)
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
        } else {
          err = -1
          return next(errorLogger(req,'unauthorized PUT method on Profile',err))
        }
      } catch (err) {
        return next(errorLogger(req,'putProfile',err))
      }
    }
} 

export default controller