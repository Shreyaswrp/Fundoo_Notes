const express = require('express');
const router = express.Router();
const user = require('../controller/userController.js');

//register a new User
router.post('/register', user.registerUser);

//route to register controller with path /login
router.post('/login', user.loginUser);

//route to register controller with path /forgot-password
router.post('/forgot-password', user.forgotPassword);

//route to register controller with path /reset-password
router.put('/reset-password', user.resetPassword);

module.exports = router;


