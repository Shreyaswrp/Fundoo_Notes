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

const noteService = require("../service/noteService");
const logger = require("../config/logger");
const utility = require("../utility/utility");

class Note {
  /**
   * @description controller to past request to create note to service
   * @param {object} req http request
   * @returns {object} res http response
   */
  createNote = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    // Validate request
    if (req.body != null || req.body != undefined) {
      //validate note content
      const { error } = utility.validateNote(req.body);
      if (error) {
        logger.error("error validate" + error);
        responseResult.success = false;
        responseResult.message = "Could not create a note";
        return res.status(422).send(responseResult);
      }
      const decodedValue = utility.verifyToken(req.headers.token);
      const noteDetails = {
        title: req.body.title,
        description: req.body.description,
        userId: decodedValue.data,
        reminder: req.body.reminder,
        colour: req.body.colour,
        image: req.body.image,
        isPinned: req.body.isPinned,
        isArchived: req.body.isArchived,
        isDeleted: req.body.isDeleted,
      };
      noteService.createNote(noteDetails, (err, data) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Could not create a note";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + data);
          responseResult.success = true;
          responseResult.data = data;
          responseResult.message = "Note created successfully";
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
   * @description Retrieve and return all notes from the database.
   * @param {object} req http request
   * @returns {object} res http response
   */
  findAllNotes = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.headers.token));
    if (req.headers.token) {
      noteService.findAllNotes((err, data) => {
        if (err) {
          logger.error("error" + err);
          responseResult.success = false;
          responseResult.message = "Could not find notes";
          return res.status(422).send(responseResult);
        } else {
          logger.info("response data" + data);
          responseResult.success = true;
          responseResult.data = data
          responseResult.message = "Notes found successfully";
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
   * @description Update notes from the database.
   * @param {object} req http request
   * @returns {object} res http response
   */
  updateNote = (req, res) => {
    console.log(req.params.noteId);
    var responseResult = {};
    // Validate request
    if (!req.body) {
      responseResult.success = false;
      responseResult.message = "Invalid Request";
      return res.status(422).send(responseResult);
    }
    logger.info("request body" + JSON.stringify(req.body));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.noteId)) {
      responseResult.success = false;
      responseResult.message = "Incorrect id.Give proper id";
      return res.status(422).send(responseResult);
    }
    const contentToUpdate = {
      fields: req.body,
      _id: req.params.noteId
    };
    noteService.updateNote(contentToUpdate, (err, data) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not update the note";
        return res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "The note updated sucessfully";
        return res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @description Delete notes from the database.
   * @param {object} req http request
   * @returns {object} res http response
   */
  deleteNote = (req, res) => {
    var responseResult = {};
    logger.info("id provided" + JSON.stringify(req.params.noteId));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.noteId)) {
      responseResult = response.NoteIdError();
      return res.status(400).send(responseResult);
    }
    noteService.deleteNote(req.params.noteId, (err, data) => {
      if (err || data == null) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not delete the note";
        return res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.message = "The note deleted sucessfully";
        return res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @description Get all the notes for the logged in user
   * @param {Object} req
   * @returns {Object} res
   */
  getUserNotes = (req, res) => {
    var responseResult = {};
    let value = utility.verifyToken(req.headers.token);
    let id = value.data;
    noteService.getNotesByUserId(id, (err, result) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not find notes";
        return res.status(422).send(responseResult);
      }else {
        logger.info("response data" + result);
        responseResult.success = true;
        responseResult.data = result;
        responseResult.message = "Notes found successfully";
        return res.status(200).send(responseResult);
      }  
    })
  }
}
module.exports = new Note();
