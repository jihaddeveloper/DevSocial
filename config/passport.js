//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum


//  Library import
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
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

        // Could get accessed in two ways:
        // 1) When registering for the first time
        // 2) When linking account to the existing one

        // console.log('profile', profile);
        // console.log('accessToken', accessToken);
        // console.log('refreshToken', refreshToken);

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
        //newUser.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

        // Save new user
        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Could get accessed in two ways:
        // 1) When registering for the first time
        // 2) When linking account to the existing one

        // // Should have full user profile over here
        // console.log('profile', profile);
        // console.log('accessToken', accessToken);
        // console.log('refreshToken', refreshToken);

        // Checking the user already registered or not
        const existingUser = await User.findOne({
            'google.id': profile.id
        });
        if (existingUser) {
            return done(null, existingUser);
        }

        //If new user
        // Create new user
        const newUser = new User();
        newUser.email = profile.emails[0].value;
        newUser.google.email = profile.emails[0].value;
        newUser.google.id = profile.id;
        newUser.name = profile.displayName;
        //newUser.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

        // Save new user
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));