import din from '../model/index.js'
import { Strategy } from 'passport-local'
import { verifyPassword } from '../controlSession/functions.js'

const localStrategy = new Strategy( (username, password, done) => {
    din.users.db.findOne({ email: username }, (err, user) => {
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

export default localStrategy