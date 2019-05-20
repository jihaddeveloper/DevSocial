//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum

//Imports
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Image save
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Import Input validator
const validatePostInput = require('../../validation/post');

//Model import
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// With single image
// @route POST /api/post/create
// @desc Create post
// @access Private
router.post('/create', upload.single('images'), passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    console.log(req.file);

    //Set Validation
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        user: req.user.id,
        postCategory: req.body.postCategory,
        name: req.body.name,
        text: req.body.text,
        avatar: req.body.avatar,
        imagePath: req.file.path
    });

    //Save new post
    newPost.save().then(post => res.json(post));
});


// With multiple images
// @route POST /api/post/create
// @desc Create post
// @access Private
router.post('/creates', upload.array('images', 3), passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    console.log(req.files);

    //Set Validation
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        user: req.user.id,
        postCategory: req.body.postCategory,
        name: req.body.name,
        text: req.body.text,
        avatar: req.body.avatar,
        image1: req.files[0].path,
        image2: req.files[1].path,
        image3: req.files[2].path
    });

    //Save new post
    newPost.save().then(post => res.json(post));
});

// @route GET /api/post/all
// @desc Get all posts
// @access Public
router.get('/all', (req, res) => {
    Post.find()
        .sort({
            createDate: -1
        })
        // .select('imageInfo')
        // .exec()
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: 'No posts found'
        }));
});

// @route GET /api/post/:post_id
// @desc Get post by post_id
// @access Public
router.get('/:post_id', (req, res) => {
    Post.findById(req.params.post_id)
        // .select('imageInfo')
        // .exec()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'No post found with that id'
        }));
});

// @route DELETE /api/post/delete/:post_id
// @desc Delete post
// @access Private
router.delete('/delete/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            notauthorized: 'User not authorized'
                        });
                    }

                    //Delete post
                    post.remove().then(() => res.json({
                        success: true
                    }));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }))
        })
});

// @route POST /api/post/like/:post_id
// @desc Like post
// @access Private
router.post('/like/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check for already liked
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            alreadyliked: 'User already liked this post'
                        });
                    }

                    //Add user id to likes arrary
                    post.likes.unshift({
                        user: req.user.id
                    });

                    //Save
                    post.save().then(post => res.json(post));
                })

                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }))
        })
});

// @route POST /api/post/unlike/:post_id
// @desc Unlike post
// @access Private
router.delete('/unlike/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    //Check for already liked
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not yet liked this post'
                        });
                    }

                    //Get user id from likes arrary
                    const removeId = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                    //Splice out of array
                    post.likes.splice(removeId, 1);

                    //Save
                    post.save().then(post => res.json(post));
                })


                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }))
        })
});

// @route POST /api/post/comment/:post_id
// @desc Add comment to post
// @access Private
router.post('/comment/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    //Set Validation
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        //If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar
            }

            //Add to comments array
            post.comments.unshift(newComment);

            //Save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});

// @route POST /api/post/comment/:post_id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Post.findById(req.params.post_id)
        .then(post => {
            //Check to see if comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({
                    commentnotexists: 'Comment does not exist'
                });
            }

            //Get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            //Splice comment out of array
            post.comments.splice(removeIndex, 1);

            //Save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});


//Export
module.exports = router;