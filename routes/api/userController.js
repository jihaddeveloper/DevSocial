//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

//  Library imports
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//Import Input validator
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Import secret file
const config = require("../../config/secret");

//Import model
const User = require("../../models/User");

//Import User controller
const userController = require("../../controller/userRouteController");

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

// @route   GET /api/user/all-user
// @desc    Get All User
// @access  Public
router.get("/all-user", async (req, res)=> {
  await User.find().then(users => {
     //Check for User
     if (!users) {
       console.log('abc')
       return res.status(404).json(errors);
     }
 
     return res.status(200).json(users);
   });
 } );

// @route   POST /api/user/register
// @desc    Register User
// @access  Public
router.post("/register", (req, res) => {
  //Set Validation
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    errors.email = "Email already exists";
    if (user) {
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));

          // // Generate Token
          // const token = signToken(newUser);

          // //Respond with token
          // res.status(200).json({
          //   token: "Bearer " + token
          // });
        });
      });
    }
  });
});

// @route   POST /api/user/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find User by email
  User.findOne({
    email: email
  }).then(user => {
    //Check for User
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched

        // Generate Token
        const token = signToken(user);

        //Respond with token
        res.status(200).json({
          token: "Bearer " + token
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET /api/user/current-user
// @desc    Return current user
// @access  Private
router.get(
  "/current-user",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// @route   POST /api/user/oauth/facebook
// @desc    Facebook oauth
// @access  Private
router.post(
  "/oauth/facebook",
  passport.authenticate("facebookToken", {
    session: false
  }),
  (req, res) => {
    // Generate Token
    const token = signToken(req.user);

    //Respond with token
    res.status(200).json({
      token: "Bearer " + token
    });
  }
);

// @route   POST /api/user/oauth/google
// @desc    Google oauth
// @access  Private
router.post(
  "/oauth/google",
  passport.authenticate("googleToken", {
    session: false
  }),
  (req, res) => {
    // Generate Token
    const token = signToken(req.user);

    //Respond with token
    res.status(200).json({
      token: "Bearer " + token
    });
  }
);

//Export
module.exports = router;
