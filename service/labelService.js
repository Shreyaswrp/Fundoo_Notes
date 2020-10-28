const Label = require("../app/models/labelModel.js");
const cache = require('../middleware/redisCache.js');
const note = require('../app/models/noteModel');

class LabelService {
  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create a label
   */
  createLabel = (data, callback) => {
    Label.create(data, (err, result) => {
      if(err || result == null){
        return callback(err, null);
      }else {
        cache.clearCache();
        return callback(null,result);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update a label
   */
  updateLabel = (data, callback) => {
    Label.update(data, (err, result) => {
      if(err){
        return callback(err, null);
      }else {
        cache.clearCache();
        return callback(null,result);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description delete a label
   */
  deleteLabel = (data, callback) => {
    Label.delete(data, (err, result) => {
      if(err || result == null){
        return callback(err, null);
      }else {
        cache.clearCache();
        return callback(null,result);
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description get notes of a logged in user
   */
  getLabelsByUserId = (data, callback) => {
    Label.read(data, (err, result) => {
      if(err){
        return callback(err, null);
      }else {
        cache.setAllLabels(result);
        return callback(null,result);
      }
    });
  }

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create label on a note
   */
  createLabelOnNote = (data, callback) => {
    Label.create(data, (err, result) => {
      if(err || result == null){
        return callback(err, null);
      }else {
        const labelData = {
          noteId: result.noteId,
          name: result.name,
          userId: result.userId,
          labelId: result._id,
        }
        return note.addLabelToNote(labelData, callback);
      }
    });
  }

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update label on a note
   */
  updateLabelOnNote = (data, callback) => {
    const labelData = {
      noteId: data.noteId,
      name: data.name,
      labelId: data._id
    }
    note.updateLabelToNote(labelData, callback);
  }

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description delete label on a note
   */
  deleteLabelOnNote = (data, callback) => {
    const labelData = {
      noteId: data.noteId,
      labelId: data._id
    }
    note.deleteLabelOnNote(labelData, callback);
  }
}

module.exports = new LabelService();
