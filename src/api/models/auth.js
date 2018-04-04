import FacebookTokenStrategy from 'passport-facebook-token'
import Passport from 'passport'
import User from './userModel'
import DotEnv from 'dotenv'

DotEnv.config()

Passport.use(new FacebookTokenStrategy({
	clientID: process.env.FB_CLIENT_ID,
	clientSecret: process.env.FB_SECRET_ID
}, (accessToken, refreshToken, profile, done) => {
	User.find({client_id: profile.id}, (err, res) => {
		if (err) res.send(err)
		if (res.length === 0) {
			User.create({
				client_id: profile.id,
				name: profile.displayName,
				picture_url: profile.photos[0].value
			}, (err) => {
				if (err) done(err)
				else done(null, profile)
			})
		} else {
			User.update({_id: res[0]._id}, {
				name: profile.displayName,
				picture_url: profile.photos[0].value
			}, (err) => {
				if (err) done(err)
				else done(null, profile)
			})
		}
	})
}
))

Passport.serializeUser((user, done) => done(null, user))

Passport.deserializeUser((user, done) => done(null, user))

export default Passport
