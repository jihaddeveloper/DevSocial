//  Author: Mohammad Jihad Hossain
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: Main entry file for rest api project for ECL E-Commerce Forum


const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    };
};