const utility = require("../utility/utility");
const userModel = require("../app/models/userModel");
const lib = require("../lib/sendMail");
require("dotenv/config");
const rabbitMQ = require('../MQ/rabbitMQ.js');
const  mq  = new rabbitMQ();

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
      const token = utility.generateToken(data.emailId);
      const mailContent = {
          receiverEmail: data.emailId,
          subject: "Email to verify email address",
          content: `<h2>Please click on given link to verify your email address</h2>
                   <span>${process.env.CLIENT_URL}/activate/${token}</span>`,
      };
      lib.sendEmail(mailContent);
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
      if(result.isEmailVerified){
      const res = utility.comparePasswords(data.password, result.password);
      if (res) {
      const token = utility.generateToken(result._id);
      return callback(null, result, token);
      } else {
      return callback("Incorrect_password", null);
      }
      }else {
        return callback('Verify_Email', null);
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
      if (err) {
        return callback(err, null);
      } else {
        const token = utility.generateToken(result._id);
        const mailContent = {
          receiverEmail: result.emailId,
          subject: "Email to reset password",
          content: `<h2>Please click on given link to reset your password</h2>
                     <span>${process.env.CLIENT_URL}/forgot-password/${token}</span>`,
        };
        lib.sendEmail(mailContent);
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
    try {
      const decodedValue = utility.verifyToken(data.token);
      const obj = {
        emailId: decodedValue.data.emailId,
        password: utility.hashPassword(data),
      };
      return userModel.updateUser(obj, callback);
    } catch (err) {
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
      if (err || result == null) {
        return callback(err, null);
      } else {
        const decodedValue = utility.verifyToken(data.token);
        if (decodedValue.data == result.emailId) {
          const mailContent = {
            emailId: result.emailId,
            subject: "Email verification confirmation",
            message: `<h2>Your email id has been verified.</h2>`,
          };
          //mq.sendToQueue(mailContent);
          mq.consumeFromQueue();
          const contentToUpdate = {
              emailId: data.emailId,
              isEmailVerified: true,
          };
        return userModel.updateUserEmailVerification(contentToUpdate, callback);
        }
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description get authorized user
   */
  getAuthorizedUser = (data, callback) => {
    return userModel.findUserById(data, callback);
  }
}
module.exports = new UserService();
