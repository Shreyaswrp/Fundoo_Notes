const bcrypt = require('bcrypt');
const userModel = require('../app/models/userSchema.js');

class UserService {

  /**
    * @params {object} data
    * @params {callback function} callback
    */
    registerUser = (data, callback) => {

        let saltRounds = 10;
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            // Store password in hash form in DB
            var user = {
                firstName: data.firstName,
                lastName: data.lastName,
                emailUser: data.emailUser,
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
    
}

module.exports = new UserService();