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
        const obj = {
          noteId: result.noteId,
          name: result.name,
          labelId: result._id
        }
        note.putLabelToNote(obj, callback);
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
        const obj = {
          noteId: result.noteId,
          name: result.name,
          labelId: result._id
        }
        note.updateLabelToNote(obj, callback);
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
        const obj = {
          noteId: result.noteId,
          name: result.name,
          labelId: result._id
        }
        note.deleteLabelOnNote(obj, callback);
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
}

module.exports = new LabelService();
