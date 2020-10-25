/*************************************************************
 *
 * Execution       : default node cmd> node greeting.controller.js
 * Purpose         : Define actions for various http methods
 *
 * @description    : Actions to be done when http methods are called.
 *
 *
 * @file           : noteController.js
 * @overview       : Actions of http methods
 * @module         : controller
 * @version        : 1.0
 * @since          : 16/11/2020
 *
 * **********************************************************/

const labelService = require("../service/labelService");
const logger = require("../config/logger");
const utility = require("../utility/utility");

class Label {
  /**
   * @description controller to past request to create label to service
   * @param {object} req http request
   * @params {object} res http response
   */
  createLabel = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    // Validate request
    if (req.body != null || req.body != undefined) {
      //validate note content
      const { error } = utility.validateLabel(req.body);
      if (error) {
        logger.error("error validate" + error);
        responseResult.success = false;
        responseResult.message = "Could not create a label.";
        return res.status(422).send(responseResult);
      }
      const decodedValue = utility.verifyToken(req.headers.token);
      const labelDetails = {
        name: req.body.name,
        noteId: req.headers.note,
        userId: decodedValue.data,
      };
      labelService.createLabel(labelDetails, (err, data) => {
        if (err || data == null){
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Could not create a label";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + data);
          responseResult.success = true;
          responseResult.data = data;
          responseResult.message = "Label created successfully for the note";
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
   * @description Update labels from the database.
   * @param {object} req http request
   * @params {object} res http response
   */
  updateLabel = (req, res) => {
    var responseResult = {};
    // Validate request
    if (!req.body) {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
    logger.info("request body" + JSON.stringify(req.body));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.labelId)) {
      responseResult.success = false;
      responseResult.message = "Incorrect id.Give proper id";
      return res.status(422).send(responseResult);
    }
    const contentToUpdate = {
      fields: req.body,
      _id: req.params.labelId
    };
    labelService.updateLabel(contentToUpdate, (err, data) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not update the label";
        return res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "The label updated sucessfully";
        return res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @description Delete labels from the database.
   * @param {object} req http request
   * @params {object} res http response
   */
  deleteLabel = (req, res) => {
    var responseResult = {};
    logger.info("id provided" + JSON.stringify(req.params.labelId));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.labelId)) {
      responseResult.success = false;
      responseResult.message = "Incorrect id.Give proper id";
      return res.status(422).send(responseResult);
    }
    labelService.deleteLabel(req.params.labelId, (err, data) => {
      if (err || data == null) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not delete the label";
        return res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.message = "The label deleted sucessfully";
        return res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @description Get all the notes for the logged in user
   * @param {Object} req
   * @param {Object} res
   */
  getUserLabels = (req, res) => {
    var responseResult = {};
    let noteId = req.headers.note
    labelService.getLabelsByUserId(noteId, (err, result) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not find labels";
        return res.status(422).send(responseResult);
      }else {
        logger.info("response data" + result);
        responseResult.success = true;
        responseResult.data = result;
        responseResult.message = "Labels found successfully";
        return res.status(200).send(responseResult);
      }  
    })
  }
}
module.exports = new Label();