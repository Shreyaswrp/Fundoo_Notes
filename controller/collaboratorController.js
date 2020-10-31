/*************************************************************
 *
 * Execution       : default node cmd> node user.controller.js
 * Purpose         : Define actions for various http methods
 *
 * @description    : Actions to be done when http methods are called.
 *
 * @file           : collaboratorController.js
 * @overview       : Actions of http methods
 * @module         : controller
 * @version        : 1.0
 * @since          : 16/11/2020
 *
 * **********************************************************/

const collabService = require("../service/collaboratorService");
const logger = require("../config/logger");
const utility = require("../utility/utility");

 class Collaborator {
 /**
   * @description Retrieve and return all emailIds from the database.
   * @param {object} req http request
   * @returns {object} res http response
   */
  findAllRegisteredEmails = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.headers.token));
    if (req.headers.token) {
      const decodedValue = utility.verifyToken(req.headers.token);
      const userId = decodedValue.data;
      collabService.findAllRegisteredEmails(userId, (err, data) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Could not find email ids";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + data);
          responseResult.success = true;
          responseResult.data = data
          responseResult.message = "Email ids found successfully";
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
   * @description Create a collaborator on a note
   * @param {Object} req
   * @returns {Object} res
   */
  createCollaboratorOnNote = (req, res) => {
    var responseResult = {};
    const decodedValue = utility.verifyToken(req.headers.token);
    const collabData = {
      noteId: req.body.noteId,
      collaboratorEmail: req.body.collaboratorEmail,
      userId: decodedValue.data
    }
    collabService.createCollaboratorOnNote(collabData, (err, result) => {
      if(err || result == null) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not create a collaborator on the note.The email id is not registered.";
        return res.status(422).send(responseResult);
      } else {
        logger.info("response data" + result);
        responseResult.success = true;
        responseResult.data = result;
        responseResult.message = "Collaborator created successfully on the note.";
        return res.status(200).send(responseResult);
      }
    });
  }

  /**
   * @description Delete a collaborator on a note
   * @param {Object} req
   * @returns {Object} res
   */
  deleteCollaboratorOnNote = (req, res) => {
    var responseResult = {};
    const collabData = {
      noteId: req.body.noteId,
      collaboratorEmail: req.body.collaboratorEmail,
    }
    collabService.deleteCollaboratorOnNote(collabData, (err, result) => {
      if(err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not delete a collaborator on the note";
        return res.status(422).send(responseResult);
      }else {
        logger.info("response data" + result);
        responseResult.success = true;
        responseResult.message = "Collaborator deleted successfully on the note.";
        return res.status(200).send(responseResult);
      }
    });
  }

/**
* Gets all the collaborators of a note
*/
getCollaborators = (req, res) => {
    const responseData = {};
    try {
      const collabData = {
        noteId: req.body.noteId
      }
      collabService.getAllCollaborators(collabData, (err, result) => {
          if(result){
            responseData.success = true;
            responseData.data = result;
            responseData.message = 'Showing All Collaborators';
            res.status(200).send(responseData);
          }else {
            responseData.success = false;
            responseData.message = 'Could not find collaborators';
            logger.error(err.message);
            res.status(err.statusCode || 500).send(responseData);
          }
      });
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };
 }

 module.exports = new Collaborator();