const Note = require("../app/models/noteModel.js");
const cache = require('../middleware/redisCache.js');

class NoteService {
  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create a note
   */
  createNote = (data, callback) => {
    return Note.createNote(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description find all notes
   */
  findAllNotes = (callback) => {
    Note.findAllNotes((err, result) => {
      if(err){
        return callback(err, null);
      }else {
        cache.setAllNotes(result);
        return callback(null,result);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update a note
   */
  updateNote = (data, callback) => {
    Note.updateNote(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description delete a note
   */
  deleteNote = (data, callback) => {
    Note.deleteNote(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description get notes of a logged in user
   */
  getNotesByUserId = (data, callback) => {
    return Note.find(data, (err, result) => {
      if(err){
        return callback(err, null);
      }else {
        cache.setUserAllNotes(result);
        return callback(null,result);
      }
    });
  }
}

module.exports = new NoteService();
