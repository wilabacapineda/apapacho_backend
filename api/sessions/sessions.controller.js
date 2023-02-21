import users from '../../daos/loadUsers.js'
import { sessionCounter, saltRounds, getSessionName, hashPassword } from '../../utils/sessionFunctions.js'
import { runLogger, errorLogger } from '../../logger/loggerSessions.js'
import sendMail from '../../mailer/mailer.js'
import dotenv from 'dotenv'
dotenv.config()

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
          req.body.avatar = req.file ? `/assets/img/avatars/${req.file.filename}` : `/assets/img/avatars/avatar.jpg`
          const findEmail = users.getByEmail(req.body.email)
                findEmail.then( r => {
                  if(r === null) {                    
                    req.body.age = parseInt(req.body.age)
                    req.body.password = hashPassword(req.body.password, saltRounds)
                    const newUser = users.saveUser(req.body)  
                          newUser.then( (u) => {
                            const emailBody = `<div>
                                                <p>Se ha realizado un nuevo registro de usuario en Apapacho.</p>
                                                <div>
                                                  <span>Datos de Registro de Usuario:</span>
                                                  <ul>
                                                    <li><strong>Email: </strong>${u.email}</li>
                                                    <li><strong>Name: </strong>${u.name}</li>
                                                    <li><strong>Lastname: </strong>${u.lastname}</li>
                                                    <li><strong>Age: </strong>${u.age}</li>
                                                    <li><strong>Address: </strong>${u.address}</li>
                                                    <li><strong>Phone: </strong>${u.phone}</li>
                                                    <li><strong>Date Created: </strong>${u.timestamp}</li>
                                                  </ul>
                                                </div>
                                              </div>`
                            
                            sendMail({
                                to: process.env.MY_EMAIL,
                                cc:u.email,
                                subject: 'Nuevo Registro en Apapacho',
                                text: '',
                                html:emailBody,    
                            }).then( info => {
                              runLogger(req,`sendMail from ${info.envelope.from} to ${info.envelope.to} response -> ${info.response}`)
                            }).catch( err => {
                              errorLogger(req,'Send Mail Rejected',`created successfull user ${u.email} but sendMail error response -> ${err}`)
                            })

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
        const aux = req.isAuthenticated() ? req.user.name : false
        req.session.destroy(err => {
            if(err){
                res.json({error: 'olvidar', body:err})
            } else {                
                res.json({name:aux})
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
      } catch (err) {
        return next(errorLogger(req,'putProfile',err))
      }
    }
} 

export default controller