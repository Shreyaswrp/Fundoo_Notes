const express = require('express');
const router = express.Router();
const userRegistration = require('../controller/userController.js');
const user = new userRegistration();

//register a new User
router.post('/register', user.registerUser);

//route to register controller with path /login
router.post('/login', user.loginUser);

module.exports = router;


