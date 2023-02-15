import client from "./client.js"
import { runLogger, errorLogger } from "../logger/loggerCart.js"

import dotenv from 'dotenv'
dotenv.config()

const sendMessageWspAdmin = (req,c) => {
    const subject = `Nuevo Pedido Orden ID-${c.id} de ${c.fullname} - ${c.email} en Apapacho`
    const options = {
        body:subject,
        from:`whatsapp:${process.env.TWILIO_PHONE}`,
        //to:`whatsapp:${process.env.MY_PHONE}` //Ya que no puedo enviar SMS a números no registrados intentaré enviarle wsp
        to:c.phone
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