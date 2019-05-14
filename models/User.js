//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Sechema defination
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String
        }
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});


//Exporting model
module.exports = mongoose.model('User', UserSchema, 'users');