//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum


const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostCategoryInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isLength(data.name, {
            min: 3,
            max: 30
        })) {
        errors.name = 'Name must be between 3 and 30 characters'
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required'
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    };
};