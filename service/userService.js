const Utility = require('../Utility/Utility.js');
const userModel = require('../app/models/userSchema.js');

class UserService {

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description register a new user in the database
    */
    registerUser = (data, callback) => {
       var user = {
            firstName: data.firstName,
            lastName: data.lastName,
            emailId: data.emailId,
            password: Utility.hashPassword(data),
        };
        userModel.findUser(user, (err, result) => {
            if (err) {
                callback(err,null);
            }else if(result != null){
                callback(null, 'user_exists');
            }else{
                userModel.createUser(user, function(err,data){
                    if (err) {
                        callback(err,null);
                    } else {
                        callback(null,data);
                    }
                });
            } 
        });
    }

 /**
   * @params {object} data
   * @params {callback function} callback
   * @description let a user login by providing correct id and password 
   */
   loginUser = (data, callback) => {
       userModel.findUser(data, (err, result) => {
            if(err || result == null) {
                callback('Invalid email', null);
            }else{ 
                const res = Utility.comparePasswords(data.password,result.password)
                if(res){
                    callback(null, result);
                }else{
                    callback('Incorrect_password', null);
                }
            }
        });
    }

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description send reset link in case the password is forgotten
    */
    forgotPassword = (data, callback) => {
        userModel.findUser(data, (err, result) => {
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
        const obj = {
            emailId: data.emailId,
            password: Utility.hashPassword(data),
        };
        userModel.updateUser(obj, (err, result) => {
            if(err) {
                callback(err, null);
            }else {
                callback(null,result);
            }   
        })
    }
}

module.exports = new UserService();