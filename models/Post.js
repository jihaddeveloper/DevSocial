//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Sechema defination
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postCategory: {
        type: Schema.Types.ObjectId,
        ref: 'PostCategory'
    },
    name: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        createDate: {
            type: Date,
            default: Date.now
        }
    }],
    createDate: {
        type: Date,
        default: Date.now
    }

});

//Exporting model
module.exports = mongoose.model('Post', PostSchema, 'posts');