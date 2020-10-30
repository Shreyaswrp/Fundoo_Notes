/*************************************************************
 *
 * Execution       : default node cmd> node user.controller.js
 * Purpose         : Define actions for various http methods
 *
 * @description    : Actions to be done when http methods are called.
 *
 * @file           : userController.js
 * @overview       : Actions of http methods
 * @module         : controller
 * @version        : 1.0
 * @since          : 16/11/2020
 *
 * **********************************************************/

const userService = require("../service/userService");
const utility = require("../utility/utility");
const logger = require("../config/logger");

class UserRegistration {
  /**
   * @description controller to past request to register user to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  registerUser = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      //validate request
      const { error } = utility.validateUser(req.body);
      if (error) {
        logger.error("error validate" + error);
        responseResult.success = false;
        responseResult.message = "Could not register a user";
        return res.status(422).send(responseResult);
      }
      const userDetails = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password,
      };
      userService.registerUser(userDetails, (err, result) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Could not register a user";
          return res.status(422).send(responseResult);
        } else if (result == "user_exists") {
          logger.warn("warning" + result);
          responseResult.success = false;
          responseResult.message = "User already exists with this email id.";
          return res.status(404).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.data = result;
          responseResult.message = "User created successfully.";
          return res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to login user to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  loginUser = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      const loginData = {
        emailId: req.body.emailId,
        password: req.body.password,
      };
      userService.loginUser(loginData, (err, result, token) => {
        if (err == "Verify_Email") {
          logger.warn('warning' + err);
          responseResult.success = false;
          responseResult.message = "Login failed.Verify your email first.";
          return res.status(422).send(responseResult);
        } else if (err || result == null) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Incorrect password or email id ! login failed.";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.token = token;
          responseResult.message = "logged in successfully.";
          return res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  forgotPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      const emailToResetPassword = {
        emailId: req.body.emailId,
      };
      userService.forgotPassword(emailToResetPassword, (err, result) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "couldn't find email to send reset password link";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.message = "A reset password link has been sent to your email successfully";
          return res.status(200).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  resetPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.headers));
    if (req.headers != null || req.headers != undefined) {
      const newPassword = {
        token: req.headers.token,
        password: req.headers.password,
      };
      userService.resetPassword(newPassword, (err, result) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "couldn't update password";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.message = "Password updated successfully";
          return res.status(200).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to verify email id to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  verifyEmailAddress = (req, res) => {
    var responseResult = {};
    if (req.body != null || req.body != undefined) {
      const emailToVerify = {
        emailId: req.body.emailId,
        token: req.headers.token,
      };
      userService.verifyEmail(emailToVerify, (err, result) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "couldn't verify email";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.message = "Your email address has been verified successfully.";
          return res.status(200).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(400).send(responseResult);
    }
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description get authorized user
   */
  getAuthorizedUser = (data, callback) => {
    return userService.getAuthorizedUser(data, callback);
  };
}

module.exports = new UserRegistration();
