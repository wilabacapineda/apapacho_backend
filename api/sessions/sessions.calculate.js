import bcrypt from 'bcrypt'
import sendMail from '../../mailer/mailer.js'
import dotenv from 'dotenv'
dotenv.config()

const calculate = {
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