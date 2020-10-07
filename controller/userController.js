/*************************************************************
 *
 * Execution       : default node cmd> node user.controller.js
 * Purpose         : Define actions for various http methods
 *
 * @description    : Actions to be done when http methods are called. 
 *                   
 *                               
 * @file           : user.controller.js
 * @overview       : Actions of http methods
 * @module         : controller
 * @version        : 1.0
 * @since          : 16/11/2020
 *
 * **********************************************************/

const userService = require('../service/userService.js');
const Utility = require('../Utility/Utility.js');
const Joi = require("joi");

class UserRegistration {

 /**
   * Function to validate request
   * @param {*} message
   */
   validateMessage = (message) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        password: Joi.string().min(8).required(),
        emailId: Joi.string().required(),
    });
    return schema.validate(message);
    }

  /**
    * controller to past request to register user to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    registerUser = (req, res) => {

        var responseResult = {};
        //validate request
        const { error } = this.validateMessage(req.body);
        if(error) {
            responseResult.success = false;
            responseResult.message = "Could not register a user";
            responseResult.error = error;
            res.status(422).send(responseResult)
        }

        if(req.body != null || defined )
        {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: req.body.password
        }
        userService.registerUser(user, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "Could not register a user";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else if(result == 'email_exist') {
                responseResult.success = false;
                responseResult.data = result;
                responseResult.message = "User already exists with this email id.";
                res.status(404).send(responseResult);
            }
            else{
                responseResult.success = true;
                responseResult.data = result;
                responseResult.message = "User created successfully.";
                res.status(201).send(responseResult);
            }
        });
        }else {
            responseResult.success = false;
            responseResult.message = "Invalid Request";
            res.status(422).send(responseResult)  
        }
    }    

    /**
    * controller to past request to login user to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    loginUser = (req, res) => {
        var responseResult = {};
        userService.loginUser(req.body, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "login failed";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                responseResult.success = true;
                const payload = {
                    id: result._id,
                    emailUser: result.emailUser,
                }
                const token = Utility.generateToken(payload);
                responseResult.token = token;
                responseResult.message = "logged in successfully.";
                res.status(201).send(responseResult);
            }
        });
    }

    /**
    * controller to past request to forgot password to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    forgotPassword = (req, res) => {
        var responseResult = {};
        const payload = {
            id: req.body._id,
            emailUser: req.body.emailUser
        }
        const token = Utility.generateTokenForPasswordReset(payload);
        userService.forgotPassword(req.body.emailUser, token, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "couldn't find email to send reset password link";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                responseResult.success = true;
                responseResult.message = "password updated successfully";
                responseResult.data = result;
                res.status(201).send(responseResult) 
            }
        })
    }
}

module.exports = new UserRegistration();