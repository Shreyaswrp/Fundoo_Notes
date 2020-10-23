const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
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
    createLabel = (data, callback) => {
      const labelData = new Label({
        name: data.name,
        noteId: data.noteId,
        userId: data.userId,
      });
      return labelData.save(callback);
    };
  
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description Update a label identified by the labelId in the request
     */
    updateLabel = (data, callback) => {
      return Label.findByIdAndUpdate(data._id, data.fields, { new: true }, callback);
    };
  
    /**
     * @params {object} data
     * @params {callback function} callback
     * @description Delete a note with the specified noteId in the request
     */
    deleteLabel = (labelId, callback) => {
      Label.findByIdAndDelete(labelId, (err, data) => {
        if (err || data == null) {
          return callback(err, null);
        } else {
          return callback(null, "Label_deleted");
        }
      });
    };

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Get all labels of a logged in user on a note
    */
    find = (data, callback) => {
      return Label.findOne({noteId: data}, callback);
    };
  }
  
  module.exports = new LabelModel();
