import bcrypt from 'bcrypt'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Strategy } from 'passport-local'
import  users from '../daos/loadUsers.js'
import dotenv from 'dotenv'
dotenv.config()

const mongoAtlasSessions = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAMESESSIONS}?retryWrites=true&w=majority`
const mongoLocalSessions = `mongodb://localhost:27017/${process.env.MONGO_DBNAMESESSIONS}?retryWrites=true&w=majority`
const connectionStringUrlSessions = process.env.MONGOENV=='atlas' ? mongoAtlasSessions : process.env.MONGOENV=='local' ? mongoLocalSessions : mongoAtlasSessions

const advanceOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const saltRounds = 10

const verifyPassword = (user,password) => {
    return bcrypt.compareSync(password, user.password)
}
const hashPassword = (password, saltRounds) => {
    return bcrypt.hashSync(password, saltRounds)
}
const checkAuth = (req,res,next) => {
    req.isAuthenticated() ?  next() : res.redirect('/login')
}
const sessionCounter = (req) => {
    if(req.session.counter){
        req.session.counter++            
    } else {            
        req.session.counter = 1                
    }
}
const getSessionName = req => req.isAuthenticated() ? req.user.name : 'Invitado'
const verifySession = req => req.session.passport ? ( req.session.passport.user ? req.session.passport.user : null ) : null 

const localStrategy = new Strategy( (username, password, done) => {
    users.db.findOne({ email: username }, (err, user) => {
      if (err) { 
        return done(err) 
      }
      if (!user) { 
        return done(null, false) 
      }
      if (!verifyPassword(user,password)) { 
        return done(null, false) 
      }
      return done(null, user)
    })
})

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
    verifyPassword,
    hashPassword,
    checkAuth,
    sessionCounter,
    getSessionName,
    sessionOptions,
    verifySession,
    localStrategy,
    advanceOptions,
    saltRounds
}