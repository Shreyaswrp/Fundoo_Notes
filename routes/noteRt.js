const express = require('express');
const router = express.Router();
const note = require('../controller/noteController.js');

//route to create a new note
router.post('/create-note', note.createNote);

//route to find all notes
router.get('/find-notes', note.findAllNotes);

//route to find a note
router.get('/find-note/:noteId', note.findOneNote);

//route to update a note
router.put('/update-note/:noteId', note.updateNote);

//route to delete a note
router.delete('/delete-note/:noteId', note.deleteNote);

module.exports = router;