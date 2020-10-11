const Note = require('../app/models/noteModel.js');

class NoteService{
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description create a note
     */
    createNote = (data,callback) => {
        Note.createNote(data,function(err, result) {
            if (err) {
                callback(err,null);
            } else {
                callback(null,result);
            }
        })
    }
    
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description find all notes
     */
    findAllNotes = (data,callback) => {
        Note.findAllNotes(data,function(err, result) {
            if (err) {
                callback(err,null);
            } else {
                callback(null, result);
            }
        })
    }
    
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description find a note
     */
    findOneNote = (data, callback) => {
        Note.findOneNote(data, (err, result) => {
            if (err) {
                callback(err,null)
            } else {
                callback(null, result);
            }
        })
    }
    
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description update a note
     */
    updateNote = (id, data, callback) => {
        Note.updateNote(id, data, (err, result) => {
            if (err) {
                callback(err,null);
            } else {
                callback(null, result);
            }
        })
    }
    
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description delete a note
     */
    deleteNote = (data, callback) => {
        Note.deleteNote(data, (err, result) => {
            if (err) {
                callback(err,null);
            } else {
                callback(null, result);
            }
        })
    }
 }
    
module.exports = new NoteService();