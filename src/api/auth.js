import FacebookTokenStrategy from 'passport-facebook-token'
import Passport from 'passport'

Passport.use(new FacebookTokenStrategy({
    clientID: "1447759218667981",
    clientSecret: "1eef39fbe6f9ff8463ea3f7a40696611"
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
));

Passport.serializeUser((user, done) => done(null, user))

Passport.deserializeUser((user, done) => done(null, user))

export default Passport