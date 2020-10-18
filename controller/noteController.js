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
const redis = require("redis");

const port_redis = process.env.REDIS_PORT;
const redis_client = redis.createClient(port_redis);

class Note {
  /**
   * @description controller to past request to create note to service
   * @params {object} data
   */
  createNote = (req, res) => {
    var responseResult = {};
    // Validate request
    if (!req.body) {
      responseResult.success = false;
      responseResult.message = "Note content cannot be null or undefined";
      res.status(400).send(responseResult);
    }
    //validate note content
    const { error } = utility.validateNote(req.body);
    if (error) {
      logger.error("error validate" + error);
      responseResult.success = false;
      responseResult.message = "Could not create a note";
      res.status(422).send(responseResult);
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
      isDeleted: req.body.isArchived,
    };
    logger.info("request body" + JSON.stringify(req.body));
    noteService.createNote(noteDetails, (err, data) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not create a note";
        res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "Note created successfully.";
        res.status(201).send(responseResult);
      }
    });
  };

  /**
   * @params {object} data
   * @description Retrieve and return all notes from the database.
   */
  findAllNotes = (req, res) => {
    var responseResult = {};
    logger.info("request body" + JSON.stringify(req.body));
    noteService.findAllNotes(req.body, (err, data) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not find notes";
        res.status(422).send(responseResult);
      } else {
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "Notes found successfully.";
        res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @params {object} data
   * @description Retrieve and return a note from the database.
   */
  findOneNote = (req, res) => {
    var responseResult = {};
    logger.info("id provided" + JSON.stringify(req.params.noteId));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.noteId)) {
      return res.status(422).send({ message: "Incorrect id.Give proper id. " });
    }
    noteService.findOneNote(req.params.noteId, (err, data) => {
      if (err || data == null) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not find a note with the given id";
        res.status(422).send(responseResult);
      } else {
        const noteData = data;
        redis_client.setex(req.params.noteId, 3600, JSON.stringify(noteData));
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "Note by the id provided found successfully.";
        res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @params {object} data
   * @description Update notes from the database.
   */
  updateNote = (req, res) => {
    var responseResult = {};
    // Validate request
    if (!req.body) {
      responseResult.success = false;
      responseResult.message = "Note content cannot be null or undefined";
      res.status(400).send(responseResult);
    }
    logger.info("request body" + JSON.stringify(req.body));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.noteId)) {
      return res.status(422).send({ message: "Incorrect id.Give proper id. " });
    }
    noteService.updateNote(req.params.noteId, req.body, (err, data) => {
      if (err) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not update note with the given id";
        res.status(422).send(responseResult);
      } else {
        const noteData = data;
        redis_client.setex(req.params.noteId, 3600, JSON.stringify(noteData));
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "The note updated successfully.";
        res.status(200).send(responseResult);
      }
    });
  };

  /**
   * @params {object} data
   * @description Delete notes from the database.
   */
  deleteNote = (req, res) => {
    var responseResult = {};
    logger.info("id provided" + JSON.stringify(req.params.noteId));
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if (!regexConst.test(req.params.noteId)) {
      return res.send({ message: "Incorrect id.Give proper id. " });
    }
    noteService.deleteNote(req.params.noteId, (err, data) => {
      if (err || data == null) {
        logger.error("error" + err);
        responseResult.success = false;
        responseResult.message = "Could not delete note with the given id";
        res.status(422).send(responseResult);
      } else {
        const noteData = data;
        redis_client.setex(req.params.noteId, 3600, JSON.stringify(noteData));
        logger.info("response data" + data);
        responseResult.success = true;
        responseResult.data = data;
        responseResult.message = "Note deleted successfully ";
        res.status(200).send(responseResult);
      }
    });
  };
}
module.exports = new Note();
