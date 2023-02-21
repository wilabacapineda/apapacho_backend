import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const createSendMail = (mailConfig) => {
    const transporter = nodemailer.createTransport(mailConfig)
    const sendMail = ({to, cc, subject, text, html, attachments}) => {
        const mailOptions = { from: mailConfig.auth.user, to, cc, subject, text,html,attachments }
        return transporter.sendMail(mailOptions)
    }
    return sendMail
}

const createSendMailProvider = () => {
    return createSendMail({
        host: process.env.EMAILHOST_GOOGLE,
        secure: false,
        port: process.env.EMAILPORT,
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.EMAILUSER_GOOGLE,
            pass: process.env.EMAILPASS_GOOGLE,    
        }
    })
}

const sendMail = createSendMailProvider()

export default sendMail