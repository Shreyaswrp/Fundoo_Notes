const utility = require("../utility/utility");
const userModel = require("../app/models/userModel");
const lib = require("../lib/sendMail");

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
        return callback(err, null);
      } else if (result != null) {
        return callback(null, "user_exists");
      } else {
        return userModel.createUser(userDetails, callback);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description let a user login by providing correct id and password
   */
  
  loginUser = (data, callback) => {
    userModel.findUser(data, (err, result) => {
      if (err || result == null) {
        return callback(err, null);
      } else {
        const res = utility.comparePasswords(data.password, result.password);
        if (res) {
          const token = utility.generateToken(result._id);
          const obj = {
            emailId: result.emailId,
            emailVerifytoken: token,
          }
          userModel.updateUserToken(obj, callback);
          return callback(null, result, token);
        } else {
          return callback("Incorrect_password", null);
        }
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description send reset link in case the password is forgotten
   */
  forgotPassword = (data, callback) => {
    userModel.findUser(data, (err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        let flag = true;
        const token = utility.generateToken(result._id);
        lib.sendEmail(token, result.emailId, flag);
        return callback(null, result);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update the password by the reset link provided
   */
  resetPassword = (data, callback) => {
    try{
     const decodedValue = utility.verifyToken(data.token);
     const obj = {
      emailId: decodedValue.data.emailId,
      password: utility.hashPassword(data),
    };
    return userModel.updateUser(obj, callback);
    }catch (err) {
      return callback(err, null);
    }
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description verfify email address of a user
   */
  
  verifyEmail = (data, callback) => {
    userModel.findUser(data, (err, result) => {
      if(err) {
        return callback(err, null);
       } else {
        const decodedValue = utility.verifyToken(result.emailVerifytoken);
        if (decodedValue.data == data.emailId){
        lib.sendEmailVerificationMail(result.emailId);
        const obj = {
        emailId: data.emailId,
        isEmailVerified: true,
        };
        return userModel.updateUserEmailVerification(obj, callback);
      }
      }
  });
};
}
module.exports = new UserService();
