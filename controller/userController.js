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
var api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'www.mydomain.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

class UserRegistration {

    /**
    * controller to past request to create user to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    registerUser = (req, res) => {
        var responseResult = {};
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailUser: req.body.emailUser,
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
        
    }    

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
                responseResult.message = "couldn't find email ";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                const data = {
                    from: 'noreply@hello.com',
                    to: req.body.emailUser,
                    subject: 'Account Activation link',                 
                };
                mailgun.messages().send(data, function(err,body){
                    if(err){
                        responseResult.success = false;
                        responseResult.message = "couldn't find email ";
                        responseResult.error = err;
                        res.status(422).send(responseResult)  
                    }else{
                        responseResult.success = true;
                        responseResult.token = body;
                        responseResult.message = "Email has been sent.Kindly follow the instructions.";
                        res.status(201).send(responseResult);
                    }

                })
                
            }
        })
    }
}

module.exports = new UserRegistration();