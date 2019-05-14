//Imports
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Import input validator
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//Model import
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET /api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Profile Works'
    });
})

// @route   GET /api/profile/current
// @desc    Get current user profile
// @access  Private
router.get(
    "/current",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const errors = {};
        Profile.findOne({
                user: req.user.id
            })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route   GET /api/profile/handle/:handle
// @desc    Get profile by handle_id
// @access  Public
router.get('/handle/:handle_id', (req, res) => {
    Profile.findOne({
            handle: req.params.handle_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET /api/profile/user/:user
// @desc    Get profile by user_id
// @access  Public
router.get('/user/:user_id', (req, res) => {
    Profile.findOne({
            user: req.params.user_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({
            profile: 'There is no profile for this user'
        }));
});

// @route   POST /api/profile/create
// @desc    Create/Update user profile
// @access  Private  
router.post(
    "/create",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        //Set Validation
        const {
            errors,
            isValid
        } = validateProfileInput(req.body);

        //Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        //Generate fields for profile
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.github) profileFields.github = req.body.github;

        //Skills spilt into array
        if (typeof req.body.skills !== "undefined") {
            profileFields.skills = req.body.skills.split(",");
        }

        //Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instragram)
            profileFields.social.instragram = req.body.instragram;

        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                if (profile) {
                    //Update
                    Profile.findOneAndUpdate({
                        user: req.user.id
                    }, {
                        $set: profileFields
                    }, {
                        new: true
                    }).then(profile => res.json(profile));
                } else {
                    //Create

                    //Check if handle exists
                    Profile.findOne({
                        handle: profileFields.handle
                    }).then(profile => {
                        if (profile) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors);
                        }

                        //save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
                }
            });
    }
);

// @route GET /api/profile/all
// @desc Get All Profile
// @access Public
router.get("/all", (req, res) => {

    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: 'There are no profile'
        }));
});

// @route   POST /api/profile/experience
// @desc    Create/Update user experience
// @access  Private
router.post('/experience', passport.authenticate("jwt", {
    session: false
}), (req, res) => {

    //Set Validation
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newExperience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Add to Experience array
            profile.experience.unshift(newExperience);

            //Save profile with new experience
            profile.save().then(profile => res.json(profile));
        });
});

// @route   DELETE /api/profile/experience/:experience_id
// @desc    Delete user experience
// @access  Private
router.delete('/experience/:experience_id', passport.authenticate("jwt", {
    session: false
}), (req, res) => {

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            //Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.experience_id);

            //Splice out of array
            profile.experience.splice(removeIndex, 1);

            //Save profile with new experience
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

// @route   POST /api/profile/education
// @desc    Create/Update user education
// @access  Private
router.post('/education', passport.authenticate("jwt", {
    session: false
}), (req, res) => {

    //Set Validation
    const {
        errors,
        isValid
    } = validateEducationInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Add to Education array
            profile.education.unshift(newEducation);

            //Save profile with new education
            profile.save().then(profile => res.json(profile));
        });
});

// @route   DELETE /api/profile/education/:education_id
// @desc    Delete user education
// @access  Private
router.delete('/education/:education_id', passport.authenticate("jwt", {
    session: false
}), (req, res) => {

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            //Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.education_id);

            //Splice out of array
            profile.education.splice(removeIndex, 1);

            //Save profile with new experience
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

// @route   DELETE /api/profile/user/delete
// @desc    Delete user and profile
// @access  Private
router.delete('/user/delete', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOneAndRemove({
        user: req.user.id
    }).then(() => {
        User.findByIdAndRemove({
            _id: req.user.id
        }).then(() =>
            res.json({
                success: true
            }));
    });
});

//Export
module.exports = router;