//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

module.exports = {
  mongoURI: "mongodb://jihad:jihad1234@ds235180.mlab.com:35180/devsocial_db",
  port: process.env.PORT || 9000,
  secretKey: "Jihad@Dev!",

  facebook: {
    clientID: process.env.FACEBOOK_ID || "412003096286841",
    clientSecret:
      process.env.FACEBOOK_SECRET || "e82159058e6b92a9529954bc01714044"
    //profileFields: ['emails', 'displayName'],
    //callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  google: {
    clientID:
      "106696738767-fnhvipol1e6o9vbvmjo4ebokin04i15b.apps.googleusercontent.com",
    clientSecret: "t-4QKytmAmrNW62T6YCZcpmy"
  }
};

//mongodb://jihad:jihad1234@ds235180.mlab.com:35180/devsocial_db
