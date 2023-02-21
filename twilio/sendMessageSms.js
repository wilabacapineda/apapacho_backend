import client from "./client.js"
import { runLogger, errorLogger } from "../logger/loggerCart.js"
import dotenv from 'dotenv'
dotenv.config()

const sendMessageSmsBuyer = (req,c) => {
    const subject = `Su Pedido en Orden ID-${c.id} en Apapacho ha sido recibido y se encuentra ya en proceso`
    const tel = c.phone.indexOf('+') > -1 ? c.phone : `+${c.phone}`
    const options = {
        body:subject,
        from:process.env.TWILIO_SMS,
        to:tel //La cuenta Trial no puede enviar a telefonos no registrados en el Sandbox
    }
    try{
        client.messages.create(options).then(() => {
            runLogger(req,`Twilio Wsp (Buyer) send Order ID-${c.id} successful to ${c.phone}`)
        }).catch(err => {
            errorLogger(req,`Twilio Wsp (Buyer) send Order ID-${c.id} Error to ${c.phone}`,err)    
        })
    } catch(err){
        errorLogger(req,`Twilio Wsp (Buyer) send Order ID-${c.id} Error to ${c.phone}`,err)
    }
}

export default sendMessageSmsBuyer