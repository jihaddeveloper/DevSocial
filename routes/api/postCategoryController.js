//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

//Imports
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Import Input validator
const validatePostCategoryInput = require('../../validation/postCategory');

//Model import
const PostCategory = require('../../models/PostCategory');

// @route POST /api/postcategory/create
// @desc Create postcategory
// @access Private
router.post('/create', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    //Set Validation
    const {
        errors,
        isValid
    } = validatePostCategoryInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPostCategory = new PostCategory({
        user: req.user.id,
        name: req.body.name,
    });

    //Save new post
    newPostCategory.save().then(postCategory => res.json(postCategory));
});

// @route GET /api/postcategory/all
// @desc Get all postcategory
// @access Public
router.get('/all', (req, res) => {
    PostCategory.find()
        .sort({
            createDate: -1
        })
        .then(postCategories => res.json(postCategories))
        .catch(err => res.status(404).json({
            nopostcategoryfound: 'No postcategory found'
        }));
});

//Export
module.exports = router;