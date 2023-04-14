
import express from 'express'
import passport from 'passport'
import {users} from '../model/index.js'
import localStrategy from './passportStrategy.js'

passport.use('login', localStrategy)
passport.serializeUser((user, done) => { done(null, user._id) })
passport.deserializeUser((id, done) => { users.db.findById(id, done) })

const { Router } = express
const routerPassport = new Router()
      routerPassport.use(passport.initialize())
      routerPassport.use(passport.session())

export default routerPassport