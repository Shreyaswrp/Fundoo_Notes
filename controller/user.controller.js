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

  /**
    * @params {object} data
    * Retrieve and return all users from the database.
    */
    findAllUsers = (req,res) => {
    var responseResult = {};
    userService.findAllUsers(req.body, function(err, data) {
        if (err) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not find users";
            res.status(422).send(responseResult);
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "Users found successfully.";
            res.status(200).send(responseResult);
        }
    });
    }

  /**
    * @params {object} data
    * Retrieve and return a user from the database.
    */
    findOneUser = (req, res) => {
    var responseResult = {};
    
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if(!regexConst.test(req.params.userId)){
        return res.status(422).send({message: "Incorrect id.Give proper id. "});
    }
    
    userService.findOneUser(req.params.userId, function(err, data) {
        if (err) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not find a user with the given id";
            res.status(422).send(responseResult);   
        }else if(data == 'not_found'){
            responseResult.success = false;
            responseResult.data = data;
            responseResult.message = "User not found ";
            res.status(404).send(responseResult);
        }
        else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "found a user with the id provided successfully.";
            res.status(200).send(responseResult);
        }
    });
    }

  /**
    * @params {object} data
    * Update users from the database.
    */
    updateUser = (req, res) => {
        var responseResult = {};

        let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
        if(!regexConst.test(req.params.userId)){
            return res.status(422).send({message: "Incorrect id.Give proper id. "});
        }
        userService.updateUser(req.params.userId, req.body, function(err, data) {
            if (err) {
                responseResult.success = false;
                responseResult.error = err;
                responseResult.message = "Could not update user with the given id";
                res.status(422).send(responseResult); 
            }else{
                responseResult.success = true;
                responseResult.data = data;
                responseResult.message = "User updated successfully.";
                res.status(200).send(responseResult);
            }
        });
    }

  /**
    * @params {object} data
    * Delete users from the database.
    */
    deleteUser = (req, res) => {
        var responseResult = {};
    
        let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
        if(!regexConst.test(req.params.userId)){
            return res.send({message: "Incorrect id.Give proper id. "});
        }
        userService.deleteUser(req.params.userId, function(err, data) {
            if (err) {
                responseResult.success = false;
                responseResult.error = err;
                responseResult.message = "Could not delete user with the given id";
                res.status(422).send(responseResult);
            }else if(data == 'not_found'){
                responseResult.success = false;
                responseResult.data = data;
                responseResult.message = "User not found ";
                res.status(404).send(responseResult);
            }else{
                responseResult.success = true;
                responseResult.data = data;
                responseResult.message = "User deleted ";
                res.status(200).send(responseResult);
            }
        });
    }

    loginUser = (req, res) => {
        var responseResult = {};

        //validate request
        const { error } = this.validateMessage(req.body);

        if(error) {
            responseResult.success = false;
            responseResult.message = "login failed";
            responseResult.error = error;
            res.status(422).send(responseResult)
        }else{
        userService.loginUser(req.body, function(err, result){
            if(err){
                responseResult.success = false;
                responseResult.message = "login failed";
                responseResult.error = err;
                res.status(422).send(responseResult) 
            }else{
                responseResult.success = true;
                responseResult.data = result;
                responseResult.message = "logged in successfully.";
                res.status(200).send(responseResult);
            }
        });
        }

    }
}

module.exports = UserRegistration;