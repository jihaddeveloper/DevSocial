//Library imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Passport config
require('./config/passport');

//Secret tokens
const secret = require('./config/secret');

//Route Controller imports
const userController = require('./routes/api/userController');
const postCategoryController = require('./routes/api/postCategoryController');
const postController = require('./routes/api/postController');
const profileController = require('./routes/api/profileController');

//Main Application
const app = express();

//Bodyparser Middleware to read from frontend
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//MongoDB Connection
mongoose
    .connect(secret.mongoURI)
    .then(() => console.log('Conntected to MongoDB'))
    .catch(err => console.log(err));


//Entery point of the Application
app.get('/', (req, res) => res.send('Hello World'));

//Using route controller
app.use('/api/user', userController);
app.use('/api/profile', profileController);
app.use('/api/post', postController);
app.use('/api/postcategory', postCategoryController);

//Serve static assets if in production or deployment
if (process.env.NODE_ENV === 'production') {

    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//Server startup
app.listen(secret.port, function (err) {
    if (err) throw err;
    console.log(`Server is Running on http://localhost:${secret.port}/`);
})