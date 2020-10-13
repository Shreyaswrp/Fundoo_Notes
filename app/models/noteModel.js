const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema ({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    reminder: {
        type: Date,
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
    },label: {
        type: String,
        default: '',
    },drawing: {
        type: String,
        default: '',
    },checkbox: {
        type: Boolean,
        default: '',
    },pin: {
        type: Boolean,
        default: '',
    },
    },
    {
        timestamps: true
});

const Note = mongoose.model('Note', NoteSchema);

class NoteModel {

/**
 * Create and Save a new Note
 */
    createNote = (data, callback) => {
        const note = new Note({title: data.title, description: data.description});
    note.save((err, result) => {
        if(err) {
            callback(err, null);
        }else{
            callback(null, result);
        }
    });
    }

/**
 * Retrieve and return all notes from the database.
 */
findAllNotes = (data, callback) => {
    Note.find(data, function(err,result) {
        if(err)return callback(err,null);
        return callback(null,result);
    })
}

/**
 * Find a single note with a noteId
 */
findOneNote = (noteId, callback) => {
    Note.findById(noteId, function(err,data){
        if(err)return callback(err,null);
        return callback(null,data);
    })
}

/**
 * Update a note identified by the noteId in the request
 */
updateNote = (id, data, callback) => {
    Note.findByIdAndUpdate(id, data,  { new: true }, function (err, post){
    if (err) return next(err);
    callback(null, post);
    });    
}

/**
 * Delete a note with the specified noteId in the request
 */
deleteNote = (noteId,callback) => {
    Note.findByIdAndDelete(noteId, (err, data) => {
    if (err || data == null) callback(err, null);
    callback(null,"Note_deleted");  
    })
}
}

module.exports = new NoteModel();