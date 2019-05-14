module.exports = {
    mongoURI: 'mongodb://jihad:jihad1234@ds235180.mlab.com:35180/devsocial_db',
    port: process.env.PORT || 5000,
    secretKey: 'Jihad@Dev!',

    facebook: {
        clientID: process.env.FACEBOOK_ID || '412003096286841',
        clientSecret: process.env.FACEBOOK_SECRET || 'e82159058e6b92a9529954bc01714044',
        //profileFields: ['emails', 'displayName'],
        //callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}