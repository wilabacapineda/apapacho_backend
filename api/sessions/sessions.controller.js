import users from '../../daos/loadUsers.js'
import { sessionCounter, saltRounds, getSessionName, hashPassword } from '../../utils/sessionFunctions.js'
import logger from '../../utils/winston.js'

const runLogger = (req) => {
  const routex = req.user ? ` ${req.url}, user:${req.user.email}` : `${req.url}`
  logger.info(`{route:${routex}, method:${req.method}}`)
}

const controller = {
    getSessionLogin: async (req, res) => {         
        sessionCounter(req)                
        runLogger(req) 
        res.status(200).json({name: getSessionName(req), counter: req.session.counter})                    
    },
    postSessionLogin: async (req, res, next) => {  
        try {                   
          sessionCounter(req)                  
          runLogger(req)
          res.sendStatus(200)
        } catch (err) {
          const error = new Error(err)
          error.httpStatusCode = 400          
          return next(error)
        }        
    },
    postSessionRegister: async (req, res, next) => {     
        try {
          sessionCounter(req)                 
          runLogger(req)
          let thumbnail = ''
          if(req.file){
            thumbnail =  req.file
          } else {
            thumbnail.filename = 'avatar.jpg'
          }
          req.body.avatar = `/assets/img/avatars/${thumbnail.filename}`            
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
        } catch (err) {
          const error = new Error(err)
          error.httpStatusCode = 400          
          return next(error)
        }
    },
    postSessionLogout: async (req,res) => {
        runLogger(req)
        const aux = req.isAuthenticated() ? req.user.name : false
        req.session.destroy(err => {
            if(err){
                res.json({error: 'olvidar', body:err})
            } else {                
                res.json({name:aux})
            }
        })
    },
} 

export default controller