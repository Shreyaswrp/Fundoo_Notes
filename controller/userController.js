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
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

class UserRegistration {

 /**
   * Function to validate request
   * @param {*} message
   */
   validateUser = (message) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        password: Joi.string().min(8).required(),
        emailId: Joi.string().min(3).required()
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

        if(req.body != null || req.body != undefined )
        {
        //validate request
        const { error } = this.validateUser(req.body);
        if(error) {
            responseResult.success = false;
            responseResult.message = "Could not register a user";
            responseResult.error = error;
            res.status(422).send(responseResult)
        }
        
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
        if(req.body != null || req.body != undefined )
        {
        userService.loginUser(req.body, function(err, result){
            if(err){
                if(err == "invalid_emailid"){
                    responseResult.success = false;
                    responseResult.message = "Invalid email id.";
                    responseResult.error = err;
                    res.status(422).send(responseResult) 
                }
                responseResult.success = false;
                responseResult.message = "Incorrect password !login failed.";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                responseResult.success = true;
                const payload = {
                    emailId: result.emailId,
                }
                const token = Utility.generateToken(payload);
                responseResult.token = token;
                responseResult.message = "logged in successfully.";
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
    * controller to past request to forgot password to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    forgotPassword = (req, res) => {
        var responseResult = {};
        
        if(req.body != null || req.body != undefined ){
            const payload = {
                emailId: req.body.emailId
            }
            const token = Utility.generateToken(payload);
        userService.forgotPassword(payload, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "couldn't find email to send reset password link";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                let mailTransporter = nodemailer.createTransport({ 
                    service: 'gmail', 
                    auth: { 
                        user: process.env.EMAIL_ID, 
                        pass: process.env.PASSWORD
                    } 
                }); 
                let mailDetails = { 
                    from: process.env.EMAIL_ID, 
                    to: result.emailId, 
                    subject: 'Email to reset password', 
                    html: `<h2>Please click on given link to reset your password</h2>
                    <span>${process.env.CLIENT_URL}/forgot-password/${token}</span>`
                }; 
                mailTransporter.sendMail(mailDetails, function(err, data) { 
                    if(err) { 
                        responseResult.success = false;
                        responseResult.message = "couldn't find email";
                        responseResult.error = err;
                        res.status(422).send(responseResult)
                    } else { 
                        responseResult.success = true;
                        responseResult.message = "A reset password link has been sent to your email successfully";
                        res.status(201).send(responseResult) 
                    } 
                }); 
            }
        })
        }else{
            responseResult.success = false;
            responseResult.message = "Invalid Request";
            res.status(422).send(responseResult)  
        }
    }

  /**
    * controller to past request to forgot password to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    resetPassword = (req, res) => {
        var responseResult = {};
    
        if(req.headers != null || req.headers != undefined ){
        let token = '';
        let obj = '';
        try{
         token = Utility.verifyToken(req.headers.token);
            obj = {
             emailId: token.data.emailId,
             password: req.headers.password
            }
        }catch(err){
            responseResult.success = false;
            responseResult.message = "Authentication error";
            responseResult.error = err;
            res.status(401).send(responseResult) 
        }
        userService.resetPassword(obj, (err,result) => {
            if(err){
                responseResult.success = false;
                responseResult.message = "couldn't update password";
                responseResult.error = err;
                res.status(422).send(responseResult)  
            }else { 
                responseResult.success = true;
                responseResult.message = "Password updated successfully";
                res.status(201).send(responseResult) 
            }
            })
        }else {
                responseResult.success = false;
                responseResult.message = "Authentication error! Request body not found";
                res.status(422).send(responseResult)
        }
    }
}

module.exports = new UserRegistration();