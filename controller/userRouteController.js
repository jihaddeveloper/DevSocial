//  Author: Mohammad Jihad Hossain
//  Create Date: 08/01/2021
//  Modify Date: 08/01/2021
//  Description: Controller/business logic of User.

//  Library imports
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");


//Import Input validator
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");


//Import secret file
const config = require("../config/secret");

//Import model
const User = require("../models/User");

//Token generator
signToken = user => {
  //JWT payload
  const payload = {
    iss: "DevJihad",
    sub: user.id,
    id: user._id,
    name: user.name,
    avatar: user.avatar,
    iat: new Date().getTime(), //Current Time
    exp: new Date().setDate(new Date().getDate() + 1) // Expiration Time
  };

  //Retun Token
  return jwt.sign(payload, config.secretKey);
};


var userController = {
    //find all User
    async all(req, res) {
       await User.find().then(users => {
          //Check for User
          if (!users) {
            return res.status(404).json(errors);
          }
      
          return res.status(400).json(users);
        });
      }
};

module.exports = userController;