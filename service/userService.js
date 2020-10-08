const bcrypt = require('bcrypt');
const userModel = require('../app/models/user.js');

class UserService {

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description register a new user in the database
    */
    registerUser = (data, callback) => {

        let saltRounds = 10;
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            // Store password in hash form in DB
            var user = {
                firstName: data.firstName,
                lastName: data.lastName,
                emailId: data.emailId,
                password: hash,
            };
        userModel.registerUser(user, function(err,result){
            if (err) {
                callback(err,null);
            } else {
                callback(null,result);
            }
        })
    }); 
    }

 /**
   * @params {object} data
   * @params {callback function} callback
   * @description login user after taking request from controller and pass it to model
   */
   loginUser = (data, callback) => {
       userModel.loginUser(data, (err, result) => {
            if(err) {
                callback(err, null);
            }else{ 
                bcrypt.compare(data.password, result.password, (err, res) => {
                    if (err) return callback(err);
                    if (!res) return callback(new Error('invalid_password'));
                    callback(null, result);
                })
            }
        });
    }

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description send reset link in case the password is forgotten
    */
    forgotPassword = (data, callback) => {
        userModel.forgotPassword(data, (err, result) => {
            if(err) {
                callback(err, null);
            }else {
                callback(null,result);
            }   
        })
    }

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description update the password by the reset link provided
    */
    resetPassword = (data, callback) => {
        let saltRounds = 10;
        bcrypt.hash(data.password, saltRounds, (err, hash) => {
            const obj = {
                emailId: data.emailId,
                password: hash
            }
            userModel.resetPassword(obj, (err, result) => {
                if(err) {
                    callback(err, null);
                }else {
                    callback(null,result);
                }   
            })
        })
    }
}

module.exports = new UserService();