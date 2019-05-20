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

//Passport config
require("./config/passport");

//Secret tokens
const secret = require("./config/secret");

//Route Controller imports
const userController = require("./routes/api/userController");
const postCategoryController = require("./routes/api/postCategoryController");
const postController = require("./routes/api/postController");
const profileController = require("./routes/api/profileController");

//Main Application
const app = express();

//Setup static folder for images and files
app.use("/uploads", express.static("uploads"));

//Bodyparser Middleware to read from from data
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//To read raw json input.
app.use(bodyParser.json());

//To see the executed url
app.use(morgan("dev"));

//Headers For API Accessing
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://eclforum.herokuapp.com/"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Headers For API Accessing
app.use(cors({ origin: "https://eclforum.herokuapp.com/" }));

//MongoDB Connection
mongoose
  .connect(secret.mongoURI)
  .then(() => console.log("Conntected to MongoDB"))
  .catch(err => console.log(err));

//Entery point of the Application
app.get("/", (req, res) => res.send("Hello World"));

//Using route controller
app.use("/api/user", userController);
app.use("/api/profile", profileController);
app.use("/api/post", postController);
app.use("/api/postcategory", postCategoryController);

//Serve static assets if in production or deployment
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Server startup
app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log(`Server is Running on http://localhost:${secret.port}/`);
});
