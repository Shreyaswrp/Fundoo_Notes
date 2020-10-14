const Note = require("../app/models/noteModel.js");

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
  findAllNotes = (data, callback) => {
    return Note.findAllNotes(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description find a note
   */
  findOneNote = (data, callback) => {
    return Note.findOneNote(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update a note
   */
  updateNote = (id, data, callback) => {
    return Note.updateNote(id, data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description delete a note
   */
  deleteNote = (data, callback) => {
    return Note.deleteNote(data, callback);
  };
}

module.exports = new NoteService();
