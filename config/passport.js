const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const secret = require('../config/secret');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret.secretKey;


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    await User.findById({
            _id: jwt_payload.id
        })
        .then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => console.log(err));
}));


//Facebook OAuth Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        // Checking the user already registered or not
        const existingUser = await User.findOne({
            'facebook.id': profile.id
        });

        //If existing user, return the user
        if (existingUser) {
            return done(null, existingUser);
        }

        // Create new user
        const newUser = new User();
        newUser.email = profile.emails[0].value;
        newUser.facebook.email = profile.emails[0].value;
        newUser.facebook.id = profile.id;
        newUser.name = profile.displayName;
        newUser.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

        // Save new user
        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));

// // Google OAuth Strategy
// passport.use('googleToken', new GooglePlusTokenStrategy({
//     clientID: config.oauth.google.clientID,
//     clientSecret: config.oauth.google.clientSecret,
//     passReqToCallback: true,
//   }, async (req, accessToken, refreshToken, profile, done) => {
//     try {
//       // Could get accessed in two ways:
//       // 1) When registering for the first time
//       // 2) When linking account to the existing one

//       // Should have full user profile over here
//       console.log('profile', profile);
//       console.log('accessToken', accessToken);
//       console.log('refreshToken', refreshToken);

//       if (req.user) {
//         // We're already logged in, time for linking account!
//         // Add Google's data to an existing account
//         req.user.methods.push('google')
//         req.user.google = {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//         await req.user.save()
//         return done(null, req.user);
//       } else {
//         // We're in the account creation process
//         let existingUser = await User.findOne({ "google.id": profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         // Check if we have someone with the same email
//         existingUser = await User.findOne({ "local.email": profile.emails[0].value })
//         if (existingUser) {
//           // We want to merge google's data with local auth
//           existingUser.methods.push('google')
//           existingUser.google = {
//             id: profile.id,
//             email: profile.emails[0].value
//           }
//           await existingUser.save()
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           methods: ['google'],
//           google: {
//             id: profile.id,
//             email: profile.emails[0].value
//           }
//         });

//         await newUser.save();
//         done(null, newUser);
//       }
//     } catch(error) {
//       done(error, false, error.message);
//     }
//   }));