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
                responseResult.message = "Could not create a user";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
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
                const obj = Utility.generateToken(payload);
                responseResult.token = obj;
                responseResult.message = "logged in successfully.";
                res.status(201).send(responseResult);
            }
        });
    }
}

module.exports = UserRegistration;