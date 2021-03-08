//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

//  Library imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const formidableMiddle = require('express-formidable');
const expessFormData = require('express-form-data');

//Main Application
const app = express();

//Passport config
require("./config/passport");

//Secret tokens
const secret = require("./config/secret");

//Headers For API Accessing
app.use(cors());

// Form data
app.use(expessFormData.parse());
//app.use(formidableMiddle());

//Route Controller imports
const userController = require("./routes/api/userController");
const postCategoryController = require("./routes/api/postCategoryController");
const postController = require("./routes/api/postController");
const profileController = require("./routes/api/profileController");

//Setup static folder for images and files
app.use("/uploads", express.static("uploads"));

// To read data
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

//To read raw json input.
// app.use(bodyParser.json());

// Bodyparser Middleware to read from from data
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// );

//To see the executed url
app.use(morgan("dev"));

//MongoDB Connection
mongoose
  .connect(secret.mongoURI)
  .then(() => console.log("Conntected to MongoDB"))
  .catch((err) => console.log(err));

//Entery point of the Application
app.get("/", (req, res) => res.send("Hello World"));

//Using route controller
app.use("/api/user", cors(), userController);
app.use("/api/profile", cors(), profileController);
app.use("/api/post", cors(), postController);
app.use("/api/postcategory", cors(), postCategoryController);

// Serve static assets if in production or deployment
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Server startup
app.listen(secret.port, function (err) {
  if (err) throw err;
  console.log(`Server is Running on http://localhost:${secret.port}/`);
});
