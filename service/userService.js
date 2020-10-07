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
    */
   loginUser = (data, callback) => {
        userModel.loginUser(data, (err, result) => {
            if(err) {
                callback(err, null);
            }else {
                if(bcrypt.compare(data.password, result.password)){
                    callback(null, result);
                }else{
                    callback("password not correct");
                }
            }
        })
    }

       
  /**
    * @params {object} data
    * @params {callback function} callback
    */
    forgotPassword = (data, token, callback) => {
        userModel.forgotPassword(data, token, (err, result) => {
            if(err) {
                callback(err, null);
            }else {
                callback(null,result);
            }   
        })
    }
    
}

module.exports = new UserService();