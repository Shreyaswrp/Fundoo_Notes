const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema ({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    reminder: {
        type: String,
    },
    collaborator: {
        type: String,
        default: '',
    },
    colour: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    addLabel: {
        type: String,
        default: '',
    },
    deleteNote: {
        type: String,
        default: '',
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    },
    {
        timestamps: true
});

const Note = mongoose.model('Note', NoteSchema);

class NoteModel {

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description create a new note in the database
    */
    createNote = (data, callback) => {
        const noteData = new Note({title: data.title, description: data.description});
            return noteData.save(callback);
    }

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Retrieve and return all notes from the database.
    */
    findAllNotes = (data, callback) => {
        return Note.find(data, callback)
    }

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Find a single note with noteId
    */
    findOneNote = (noteId, callback) => {
        return Note.findById(noteId, callback)
    }

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Update a note identified by the noteId in the request
    */
    updateNote = (id, data, callback) => {
        return Note.findByIdAndUpdate(id, data,  { new: true }, callback)    
    }

    /**
    * @params {object} data
    * @params {callback function} callback
    * @description Delete a note with the specified noteId in the request
    */
    deleteNote = (noteId,callback) => {
        Note.findByIdAndDelete(noteId, (err, data) => {
            if (err || data == null) {
                return callback(err, null);
            }else {    
                return callback(null,"Note_deleted");
            }  
        })
    }
}

module.exports = new NoteModel();