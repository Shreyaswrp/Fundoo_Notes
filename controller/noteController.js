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

const noteService = require('../service/noteService.js');
const Joi = require("joi");

class  Note{

/**
   * Function to validate request
   * @param {*} note
   */
validateNote = (note) => {
    const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    });
    return schema.validate(note);
}

/**
 * @description controller to past request to create note to service
 * @params {object} data
 */
createNote = (req, res) => {

    var responseResult = {};
    // Validate request
    const { error } = this.validateNote(req.body);
    if (error) {
        responseResult.success = false;
        responseResult.message = "Could not create a note";
        responseResult.error = errors;
        res.status(422).send(responseResult)
    }else{
        const note = {
            title: req.body.title,
            description: req.body.description,
        }
    noteService.createNote(note, function(err, data) {
        if (err) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not create a note";
            res.status(422).send(responseResult);
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "Note created successfully.";
            res.status(201).send(responseResult);
        }
    });
    }
}

/**
 * @params {object} data
 * @description Retrieve and return all notes from the database.
 */

findAllNotes = (req,res) => {
    var responseResult = {};
    noteService.findAllNotes(req.body, function(err, data) {
        if (err) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not find notes";
            res.status(422).send(responseResult);
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "Notes found successfully.";
            res.status(200).send(responseResult);
        }
    });
}

/**
 * @params {object} data
 * @description Retrieve and return a note from the database.
 */
findOneNote = (req, res) => {
    var responseResult = {};
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if(!regexConst.test(req.params.noteId)){
        return res.status(422).send({message: "Incorrect id.Give proper id. "});
    }
    noteService.findOneNote(req.params.noteId, function(err, data) {
        if (err || data == null) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not find a note with the given id";
            res.status(422).send(responseResult);   
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "Note by the id provided found successfully.";
            res.status(200).send(responseResult);
        }
    });
}

/**
 * @params {object} data
 * @description Update notes from the database.
 */
updateNote = (req, res) => {
    var responseResult = {};
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if(!regexConst.test(req.params.noteId)){
        return res.status(422).send({message: "Incorrect id.Give proper id. "});
    }
    const noteUpdate = {
        title: req.body.title,
        description: req.body.description
    }
    noteService.updateNote(req.params.noteId, noteUpdate, function(err, data) {
        if (err) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not update note with the given id";
            res.status(422).send(responseResult); 
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "The note updated successfully.";
            res.status(200).send(responseResult);
        }
    });
}

/**
 * @params {object} data
 * @description Delete notes from the database.
 */
deleteNote = (req, res) => {
    console.log(req.params.noteId);
    var responseResult = {};
    let regexConst = new RegExp(/^[a-fA-F0-9]{24}$/);
    if(!regexConst.test(req.params.noteId)){
        return res.send({message: "Incorrect id.Give proper id. "});
    }
    noteService.deleteNote(req.params.noteId, function(err, data) {
        if (err || data == null) {
            responseResult.success = false;
            responseResult.error = err;
            responseResult.message = "Could not delete note with the given id";
            res.status(422).send(responseResult);
        }else{
            responseResult.success = true;
            responseResult.data = data;
            responseResult.message = "Note deleted successfully ";
            res.status(200).send(responseResult);
        }
    });
}
}
module.exports = new Note();