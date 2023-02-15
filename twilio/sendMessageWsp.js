import client from "./client.js"
import { runLogger, errorLogger } from "../logger/loggerCart.js"

import dotenv from 'dotenv'
dotenv.config()

const sendMessageWspAdmin = (req,c) => {
    const subject = `Nuevo Pedido Orden ID-${c.id} de ${c.fullname} - ${c.email} en Apapacho`
    const tel = c.phone.indexOf('+') > -1 ? c.phone : `+${c.phone}`
    const options = {
        body:subject,
        from:`whatsapp:${process.env.TWILIO_PHONE}`,
        to:`whatsapp:${process.env.MY_PHONE}` 
        //to:`whatsapp:${tel}` //La cuenta Trial no puede enviar a telefonos no registrados en el Sandbox
    }

    try{
        client.messages.create(options).then(message => {
            runLogger(req,`Twilio Wsp send (Admin) Order ID-${c.id} successful to ${c.phone}`)
        }).catch(err => {
            errorLogger(req,`Twilio Wsp send (Admin) Order ID-${c.id} Error to ${c.phone}`,err)
        })
    } catch(err){
        errorLogger(req,`Twilio Wsp send (Admin) Order ID-${c.id} Error to ${c.phone}`,err)
    }
}

export default sendMessageWspAdmin