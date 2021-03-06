const mongoose = require("mongoose");
const { Schema } = mongoose;
const note = require('./noteModel');

const LabelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      required: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "notes",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Label = mongoose.model("Label", LabelSchema);

class LabelModel {
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description create a new label in the database
     */
    create = (data, callback) => {
          const labelData = new Label({
            name: data.name,
            userId: data.userId,
            noteId: data.noteId
          });
          return labelData.save(callback);
    };
  
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description Update a label identified by the labelId in the request
     */
    update = (data, callback) => {
      return Label.findByIdAndUpdate(data._id, data.fields, { new: true }, callback);
    };
    
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description Update a label identified by the labelId in the request
     */
    updateLabelName = (data, callback) => {
      return Label.findByIdAndUpdate(data._id, data, { new: true }, callback);
    };

    /**
     * @params {object} data
     * @params {callback function} callback
     * @description Delete a note with the specified noteId in the request
     */
    
    delete = (labelId, callback) => {
      Label.findByIdAndDelete(labelId, (err, data) => {
        if (err || data == null) {
          return callback(err, null);
        } else {
          return callback(null, data);
        }
      });
    };

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Get all labels of a logged in user on a note
    */
    read = (callback) => {
      return Label.find(callback);
    };
  }
  
  module.exports = new LabelModel();
