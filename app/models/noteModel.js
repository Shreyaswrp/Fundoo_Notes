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
    type: Array,
    ref: "labels",
    },
    collaborators: {
      type: Array,
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
   * @returns {callback function} callback
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
   * @returns {callback function} callback
   * @description Retrieve and return all notes from the database.
   */
  findAllNotes = (callback) => {
    return Note.find(callback);
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Update a note identified by the noteId in the request
   */
  updateNote = (data, callback) => {
    return Note.findByIdAndUpdate(data._id, data.fields, { new: true }, callback);
  };

  /**
  * @params {object} data
  * @params {callback function} callback
  * @description Update a label on a note identified by the labelId in the request
  */
  updateLabelOnNote = (data, callback) => {
      return Note.findByIdAndUpdate(data._id, data, { new: true }, callback);
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
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
   * @returns {callback function} callback
   * @description Get all notes of a logged in user
   */
  find = (data, callback) => {
    return Note.findOne({userId: data}, callback);
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Find a note
   */
  findNoteById = (data, callback) => {
    return Note.findById(data, callback);
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Add label to note
   */
  addLabelToNote = (data, callback) => {
    Note.updateOne( {_id: data.noteId }, 
      { $push: {labels: data}}, (err, result) => {
        if(err) {
          return callback(err, null);
        }else {
          return callback(null, data);
        }
      });
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Add collaborator to note
   */
  addCollaboratorToNote = (data, callback) => {
    Note.updateOne( {_id: data.noteId }, 
      { $addToSet: {collaborators: data}}, (err, result) => {
        if(err) {
          return callback(err, null);
        }else {
          return callback(null, data);
        }
    });
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Update label data on a note
   */
  updateLabelToNote = (data, callback) => {
    Note.updateOne( {_id: data.noteId, "labels._id": data._id }, 
      { $set: {"labels.$.name": data.name}}, (err, result) => {
        if(err) {
          return callback(err, null);
        }else {
          return callback(null, data);
        }
      });
  };

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Find on labels on a note
   */
  findAllLabelsLabelOnNote = (callback) => {
    const labelData = [];
    Note.find((err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        result.forEach(element => {
          labelData.push(element.labels);
        })
        return callback(null, labelData);
      }
    });
  }

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Find on collaborators of all the notes
   */
  findAllCollaboratorsOnNote = (callback) => {
    const collabData = [];
    Note.find((err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        result.forEach(element => {
          collabData.push(element.collaborators);
        })
        return callback(null, collabData);
      }
    });
  }

  /**
   * @params {object} data
   * @returns {callback function} callback
   * @description Find all collaborators on a note
   */
  findCollaboratorsOnNote = (data, callback) => {
    const collabData = [];
    Note.findOne({_id: data}, (err, result) => {
      if(err) {
        return callback(err, null);
      }else {
        result.collaborators.forEach(element => {
          collabData.push(element);
        })
        return callback(null, collabData);
      }
    });
  }
}
module.exports = new NoteModel();
