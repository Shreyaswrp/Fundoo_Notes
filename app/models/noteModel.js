const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = mongoose.Schema({
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
      ref: 'users',
      required: true,
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
      isDeleted: data.isArchived,
    });
    return noteData.save(callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Retrieve and return all notes from the database.
   */
  findAllNotes = (data, callback) => {
    return Note.find(data, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Find a single note with noteId
   */
  findOneNote = (noteId, callback) => {
    return Note.findById(noteId, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description Update a note identified by the noteId in the request
   */
  updateNote = (id, data, callback) => {
    return Note.findByIdAndUpdate(id, data, { new: true }, callback);
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
}

module.exports = new NoteModel();
