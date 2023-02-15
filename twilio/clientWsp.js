import twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNTSID
const authToken = process.env.TWILIO_AUTHTOKEN
const client = twilio(accountSid, authToken)

export default client

