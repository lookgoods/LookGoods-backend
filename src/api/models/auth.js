import FacebookTokenStrategy from 'passport-facebook-token'
import Passport from 'passport'
import User from '../models/userModel'

Passport.use(new FacebookTokenStrategy({
    clientID: "1447759218667981",
    clientSecret: "1eef39fbe6f9ff8463ea3f7a40696611"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreateUser({client_id: profile.id}, done => {
      done(null, profile)
    })
    
  }
))

Passport.serializeUser((user, done) => done(null, user))

Passport.deserializeUser((user, done) => done(null, user))

export default Passport