//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Sechema defination
const PostCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

//Exporting model
module.exports = mongoose.model('PostCategory', PostCategorySchema, 'postCategories');