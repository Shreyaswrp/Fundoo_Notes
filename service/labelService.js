const Label = require("../app/models/labelModel.js");
const cache = require('../middleware/redisCache.js');
const note = require('../app/models/noteModel');

class LabelService {
  /**
   * @params {object} data
   * @returns {callback function} callback
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
   * @returns {callback function} callback
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
   * @returns {callback function} callback
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
   * @returns {callback function} callback
   * @description get notes of a logged in user
   */
  getAllLabels = (callback) => {
    Label.read( (err, result) => {
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
   * @returns {callback function} callback
   * @description create label on a note
   */
  createLabelOnNote = (data, callback) => {
    Label.create(data, (err, result) => {
      if(err || result == null){
        return callback(err, null);
      }else {
        return note.addLabelToNote(result, callback);
      }
    });
  }

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description update label on a note
   */
  updateLabelOnNote = (data, callback) => {
    Label.updateLabelName(data, (err, result) => {
      if(err){
        return callback(err, null);
      }else {
        note.updateLabelToNote(result, callback);
      }
    });
  }

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description delete label on a note
   */
  deleteLabelOnNote = (data, callback) => {
    note.findAllLabelsLabelOnNote((err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        const newArray = [];
        result.forEach(element => {
          element.forEach( index => {
          if(index._id != data._id) {
              newArray.push(index);
            }
          });
        });
        const labelToUpdate = {
          _id: data.noteId,
          labels: newArray
        }
        note.updateLabelOnNote(labelToUpdate, callback);
      }
    });
  }
}

module.exports = new LabelService();
