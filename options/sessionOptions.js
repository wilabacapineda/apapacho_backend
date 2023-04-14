import session from 'express-session'
import MongoStore from 'connect-mongo'
import { connectionStringUrlSessions } from './connectionString.js'
import dotenv from 'dotenv'
dotenv.config()

const advanceOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const sessionOptions = session({
    store: new MongoStore({
      mongoUrl:connectionStringUrlSessions, 
      mongoOptions: advanceOptions,
      ttl: 600,
      autoRemove: 'interval',
      autoRemoveInterval: 10 // In minutes. Default       
    }),
    secret: process.env.SECRET,
    resave:true,
    rolling:true,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*10},
})

export {
    sessionOptions,
    advanceOptions
}