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

const userService = require('../services/user.service.js');
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
            email: Joi.string().required()
        });
        return schema.validate(message);
    }

    /**
    * controller to past request to create user to service
    * @param {httpRequest} req
    * @param {httpresponse} res
    */
    createUser = (req, res) => {

        var responseResult = {};

        //validate request
        const { error } = this.validateMessage(req.body);

        if(error) {
            responseResult.success = false;
            responseResult.message = "Could not create a user";
            responseResult.error = error;
            res.status(422).send(responseResult)
        }else{
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            }
        userService.createUser(user, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "Could not create a user";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                responseResult.success = true;
                responseResult.data = result;
                responseResult.message = "User created successfully.";
                res.status(200).send(responseResult);
            }
        });
        }
    }    
}

module.exports = UserRegistration;