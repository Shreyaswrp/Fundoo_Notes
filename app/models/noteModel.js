const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
    },
    description: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    reminder: {
      type: String,
    },
    colour: {
      type: String,
    },
    image: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: [Object],   
    },
    collaborators: {
      type: [Object],
    },  
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Note = mongoose.model("Note", NoteSchema);

class NoteModel {
  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create a new note in the database
   */
  createNote = (data, callback) => {
    const noteData = new Note({
      title: data.title,
      description: data.description,
      userId: data.userId,
      reminder: data.reminder,
      colour: data.colour,
      image: data.image,
      isPinned: data.isPinned,
      isArchived: data.isArchived,
      isDeleted: data.isDeleted,
    });
    return noteData.save(callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Retrieve and return all notes from the database.
   */
  findAllNotes = (callback) => {
    return Note.find(callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Update a note identified by the noteId in the request
   */
  updateNote = (data, callback) => {
    return Note.findByIdAndUpdate(data._id, data.fields, { new: true }, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Delete a note with the specified noteId in the request
   */
  deleteNote = (noteId, callback) => {
    Note.findByIdAndDelete(noteId, (err, data) => {
      if (err || data == null) {
        return callback(err, null);
      } else {
        return callback(null, "Note_deleted");
      }
    });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Get all notes of a logged in user
   */
  find = (data, callback) => {
    return Note.findOne({userId: data}, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Find a note
   */
  findNoteById = (data, callback) => {
    return Note.findById(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Add label to note
   */
  addLabelToNote = (data, callback) => {
    const dataLabel = {
      name: data.name,
      labelId: data._id,
    }
    Note.updateOne( {_id: data.noteId }, 
      { $push: {labels: dataLabel}}, (err, result) => {
        if(err) {
          return callback(err, null);
        }else {
          return callback(null, dataLabel);
        }
      });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Update label data on a note
   */
  updateLabelToNote = (data, callback) => {
    const updatedLabelData = {
      noteId: data.noteId,
      name: data.name,
      labelId: data.labelId
    }
    Note.updateOne( {_id: data.noteId, "labels.labelId": data.labelId }, 
      { $set: {"labels.$.name": data.name}}, (err, result) => {
        if(err) {
          return callback(err, null);
        }else {
          return callback(null, updatedLabelData);
        }
      });
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Delete label on a note
   */
  deleteLabelOnNote = (data, callback) => {
    Note.updateOne( {_id: data.noteId }, 
      { $pull: {labels: {labelId: data.labelId}}}, callback);
  }
}
module.exports = new NoteModel();
