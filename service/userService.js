const utility = require("../utility/utility");
const userModel = require("../app/models/userModel");
const lib = require("../lib/sendMail");
require("dotenv/config");
const EventEmitter = require('events');
const emitter = new EventEmitter();
const producer = require('../MQ/producer');
const consumer = require('../MQ/consumer');
const cache = require('../middleware/redisCache.js');

class UserService {
  /**
   * @params {object} data
   * @returns {callback function} callback
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
      cache.clearCache();
      const token = utility.generateToken(data.emailId);
      const mailContent = {
          receiverEmail: data.emailId,
          subject: `Email to verify email address`,
          content: `Please click on given link to verify your email address
                   ${process.env.CLIENT_URL}/activate/${token}`,
      };
      lib.sendEmail(mailContent);
      return userModel.createUser(userDetails, callback);
    }
  });
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
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
   * @returns {callback function} callback
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
          content: `Please click on given link to reset your password
                    ${process.env.CLIENT_URL}/forgot-password/${token}`,
        };
        lib.sendEmail(mailContent);
        return callback(null, result);
      }
    });
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
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
   * @returns {callback function} callback
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
            receiverEmail: result.emailId,
            subject: `Email verification`,
            content: `Your email id has been verified.`,
          };
          emitter.on('SentToQueue', () => {
            producer.sendToQueue(mailContent);
          })
          emitter.emit('SentToQueue');
          emitter.on('ConsumeFromQueue', () => {
            consumer.consumeFromQueue();
          })
          emitter.emit('ConsumeFromQueue');
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
   * @returns {callback function} callback
   * @description get authorized user
   */
  getAuthorizedUser = (data, callback) => {
    return userModel.findUserById(data, callback);
  }

  
}
module.exports = new UserService();
