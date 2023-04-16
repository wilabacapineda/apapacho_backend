import {users} from '../../model/index.js'
import { runLogger, errorLogger } from '../../logger/loggerSessions.js'
import bcrypt from 'bcrypt'
import sendMail from '../../mailer/mailer.js'
import dotenv from 'dotenv'
dotenv.config()

const calculate = {
    getSessionLogin:(req,res)=>{
        res.status(200).json({name: calculate.getSessionName(req), sessionActive: calculate.getSessionActive(req), counter: req.session.counter})                    
    },
    postSessionRegister:(req,res)=> {
        req.body.avatar = req.file ? `/assets/img/avatars/${req.file.filename}` : ( req.body.avatar ? req.body.avatar : `/assets/img/avatars/avatar.jpg`)
        const findEmail = users.getByEmail(req.body.email)
              findEmail.then( r => {
                if(r === null) {   
                  req.body.age = parseInt(req.body.age)
                  req.body.password = calculate.hashPassword(req.body.password) 
                  const newUser = users.saveUser(req.body)  
                        newUser.then( (u) => {
                          calculate.sendRegisterMail(req,u)
                          return res.json({
                              success: true,
                              message: "Registro exitoso!"                          
                          })
                        }).catch( r => {
                          res.send({error: 'error al registrar usuario','log':r})
                        })                    
                } else {
                  res.sendStatus(302)
                }
              }).catch( r => {
                res.send({error: 'error al registrar usuario'})
              })
    },
    postSessionLogout:(req,res)=>{
        req.session.destroy(err => {
            if(err){
                res.json({error: 'olvidar', body:err})
            } else {                
                res.json({name:calculate.getSessionName(req)})
            }
        }) 
    },
    putProfile:(req,res)=>{
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
    },
    passwordChange:(req,res)=>{
      const findEmail = users.getByEmail(req.user.email)
            findEmail.then( r => {
              if(r === null) {  
                res.sendStatus(302)
              } else { 
                req.body.password = calculate.hashPassword(req.body.passwordNew) 
                req.body.email=req.user.email
                delete req.body.username
                delete req.body.passwordNew
                const newUser = users.updateUser(req.body) 
                      newUser.then( (nu) => {  
                        nu.length === 0 ? res.send({error: 'usuario no encontrado'}) : calculate.postSessionLogout(req,res)                        
                      })                       
              }
            }).catch( r => {
              res.send({error: 'error al cambiar contraseña de usuario'})
            })
    },
    getSessionActive: req => req.isAuthenticated() ? true : false, 
    getSessionName: req => req.isAuthenticated() ? req.user.name : 'Invitado',
    hashPassword: (password, saltRounds=10) => bcrypt.hashSync(password, saltRounds),
    sendRegisterMail: (req,u) => {
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
    }
}

export default calculate