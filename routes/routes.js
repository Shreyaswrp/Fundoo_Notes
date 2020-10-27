const express = require('express');
const router = express.Router();
const user = require('../controller/userController.js');
const note = require('../controller/noteController.js');
const auth = require('../middleware/authorizeUser.js');
const cache = require('../middleware/redisCache.js');
const label = require('../controller/labelController.js');

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
router.get('/find-notes', auth.authorizeUser, cache.getAllNotes, note.findAllNotes);

//route to update a note
router.put('/update-note/:noteId', auth.authorizeUser, note.updateNote);

//route to delete a note
router.delete('/delete-note/:noteId', auth.authorizeUser, note.deleteNote);

//route to get all notes of a logged in user
router.get('/find-user-notes', auth.authorizeUser, cache.getAllNotesOfUser, note.getUserNotes);

//route to create a new label
router.post('/create-label', auth.authorizeUser, label.createLabel);

//route to create a new label on a note
router.post('/create-label-note', auth.authorizeUser, label.createLabelOnNote);

//route to find labels of a logged in user on a particular note
router.get('/find-labels', auth.authorizeUser, cache.getAllLabels, label.getUserLabels);

//route to update a label
router.put('/update-label/:labelId', auth.authorizeUser, label.updateLabel);

//route to update a label on a note
router.put('/update-label-note/:labelId', auth.authorizeUser, label.updateLabelOnNote);

//route to delete a note
router.delete('/delete-label/:labelId', auth.authorizeUser, label.deleteLabel);

//route to delete a note on a note
router.delete('/delete-label-note/:labelId', auth.authorizeUser, label.deleteLabelOnNote);

module.exports = router;


