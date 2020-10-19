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
const lib = require("../lib/sendMail");
const logger = require("../config/logger");
const response = require('../utility/static');

class UserRegistration {
  /**
   * @description controller to past request to register user to service
   * @params {object} data
   * @params {response} http response
   */
  registerUser = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      //validate request
      const { error } = utility.validateUser(req.body);
      if (error) {
        logger.error("error validate" + error);
        responseResult = response.registerUserError();
        res.status(422).send(responseResult);
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
          responseResult = response.registerUserError();
          res.status(422).send(responseResult);
        } else if (result == "user_exists") {
          logger.error("error" + result);
          responseResult = response.errorUserExists();
          res.status(404).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult = response.successRegisterResponse(result);
          res.status(201).send(responseResult);
        }
      });
    } else {
          responseResult = response.invalidRequest();
          res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to login user to service
   * @param {object} data
   * @params {response} http response
   */
  loginUser = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      const obj = {
        emailId: req.body.emailId,
        password: req.body.password,
      };
      userService.loginUser(obj, (err, result, token) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult = response.loginFailed();
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult = response.loginSuccess(token);
          res.status(201).send(responseResult);
        }
      });
    } else {
        responseResult = response.invalidRequest();
        res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} data
   * @params {response} http response
   */
  forgotPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      const obj = {
        emailId: req.body.emailId,
      };
      userService.forgotPassword(obj, (err, result) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult = response.forgotPasswordError();
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult = response.forgotPasswordSuccess();
          res.status(200).send(responseResult);
        }
      });
    } else {
      responseResult = response.invalidRequest();
      res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} data
   * @params {response} http response
   */
  resetPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.headers));
    if (req.headers != null || req.headers != undefined) {
      const obj = {
        token: req.headers.token,
        password: req.headers.password
      }
      userService.resetPassword(obj, (err, result) => {
        if (err) {
          logger.error("error" + err);
          responseResult = response.resetPasswordError();
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult = response.resetPasswordSuccess();
          res.status(200).send(responseResult);
        }
      });
    } else {
      responseResult = response.invalidRequest();
      res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to verify email id to service
   * @param {object} data
   * @params {response} http response
   */
  verifyEmailAddress = (req, res) => {
    var responseResult = {};
    if (req.body) {
        const obj = {
          emailId: req.body.emailId,
        };
        userService.verifyEmail(obj, (err, result) => {
          if (err) {
            logger.error("error" + err);
            responseResult = response.emailVerifyError();
            res.status(422).send(responseResult);
          } else {
            logger.info("response data" + result);
            responseResult = response.emailVerifySuccess();
            res.status(200).send(responseResult);
          }
        });
      }
     else {
      responseResult = response.invalidRequest();
      res.status(400).send(responseResult);
    }
  };
}

module.exports = new UserRegistration();
