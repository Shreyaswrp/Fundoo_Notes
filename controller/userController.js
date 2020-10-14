/*************************************************************
 *
 * Execution       : default node cmd> node user.controller.js
 * Purpose         : Define actions for various http methods
 *
 * @description    : Actions to be done when http methods are called.
 *
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

class UserRegistration {
  /**
   * @description controller to past request to register user to service
   * @params {object} data
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
          responseResult.success = false;
          responseResult.message = "Could not register a user";
          res.status(422).send(responseResult);
        } else if (result == "user_exists") {
          logger.error("error" + result);
          responseResult.success = false;
          responseResult.message = "User already exists with this email id.";
          res.status(404).send(responseResult);
        } else {
          logger.info("respnse data" + result);
          responseResult.success = true;
          responseResult.data = result;
          responseResult.message = "User created successfully.";
          res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to login user to service
   * @param {object} data
   */
  loginUser = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));

    if (req.body != null || req.body != undefined) {
      const payload = {
        emailId: req.body.emailId,
        password: req.body.password,
      };
      userService.loginUser(payload, (err, result) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message =
            "Incorrect password or email id ! login failed.";
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          const token = utility.generateToken(result.emailId);
          responseResult.token = token;
          responseResult.message = "logged in successfully.";
          res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} data
   */
  forgotPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.body != null || req.body != undefined) {
      const payload = {
        emailId: req.body.emailId,
      };
      const token = utility.generateToken(payload);
      userService.forgotPassword(payload, (err, result) => {
        if (err || result == null) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message =
            "couldn't find email to send reset password link";
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          lib.sendEmail(token, result.emailId);
          responseResult.success = true;
          responseResult.message =
            "A reset password link has been sent to your email successfully";
          res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      res.status(422).send(responseResult);
    }
  };

  /**
   * @description controller to past request to forgot password to service
   * @param {object} data
   */
  resetPassword = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    if (req.headers != null || req.headers != undefined) {
      let token = "";
      let obj = "";
      try {
        token = utility.verifyToken(req.headers.token);
        obj = {
          emailId: token.data.emailId,
          password: req.headers.password,
        };
      } catch (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Authentication error";
        res.status(401).send(responseResult);
      }
      userService.resetPassword(obj, (err, result) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "couldn't update password";
          res.status(422).send(responseResult);
        } else {
          logger.info("response data" + result);
          responseResult.success = true;
          responseResult.message = "Password updated successfully";
          res.status(201).send(responseResult);
        }
      });
    } else {
      responseResult.success = false;
      responseResult.message = "Authentication error! Request body not found";
      res.status(422).send(responseResult);
    }
  };
}

module.exports = new UserRegistration();
