const utility = require('../utility/utility.js');
const userModel = require('../app/models/userModel.js');

class UserService {

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description register a new user in the database
    */
    registerUser = (data, callback) => {
       var userDetails = {
            firstName: data.firstName,
            lastName: data.lastName,
            emailId: data.emailId,
            password: utility.hashPassword(data),
        };
        userModel.findUser(userDetails, (err, result) => {
            if (err) {
                return callback(err,null);
            }else if(result != null){
                return callback(null, 'user_exists');
            }else{
                return userModel.createUser(userDetails, callback); 
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
                return callback(err, null);
            }else { 
                const res = utility.comparePasswords(data.password,result.password)
                if(res) {
                    return callback(null, result);
                }else {
                    return callback('Incorrect_password', null);
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
        return userModel.findUser(data, callback);
    }

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description update the password by the reset link provided
    */
    resetPassword = (data, callback) => {
        const obj = {
            emailId: data.emailId,
            password: utility.hashPassword(data),
        };
            return userModel.updateUser(obj, callback);
    }
}

module.exports = new UserService();