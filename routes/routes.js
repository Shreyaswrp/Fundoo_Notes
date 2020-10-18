const express = require('express');
const router = express.Router();
const user = require('../controller/userController.js');
const note = require('../controller/noteController.js');
const auth = require('../middleware/authorizeUser.js');

//register a new User
router.post('/register', user.registerUser);

//route to verify email address
router.post('/verify-email', user.verifyEmailAddress);

//route to register controller with path /login
router.post('/login', user.loginUser);

//route to register controller with path /forgot-password
router.post('/forgot-password', user.forgotPassword);

//route to register controller with path /reset-password
router.put('/reset-password', user.resetPassword);

//route to create a new note
router.post('/create-note', auth.authorizeUser, note.createNote);

//route to find all notes
router.get('/find-notes', auth.authorizeUser, note.findAllNotes);

//route to find a note
router.get('/find-note/:noteId', auth.authorizeUser, note.findOneNote);

//route to update a note
router.put('/update-note/:noteId', auth.authorizeUser, note.updateNote);

//route to delete a note
router.delete('/delete-note/:noteId', auth.authorizeUser, note.deleteNote);

module.exports = router;


