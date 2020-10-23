const Label = require("../app/models/labelModel.js");
const cache = require('../middleware/redisCache.js');

class LabelService {
  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create a label
   */
  createLabel = (data, callback) => {
    return Label.createLabel(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update a label
   */
  updateLabel = (data, callback) => {
    return Label.updateLabel(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description delete a label
   */
  deleteLabel = (data, callback) => {
    return Label.deleteLabel(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description get notes of a logged in user
   */
  getLabelsByUserId = (data, callback) => {
    Label.find(data, (err, result) => {
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
