const express = require('express');
const router = express.Router();
const user = require('../controller/userController.js');

//register a new User
router.post('/register', user.registerUser);

//route to register controller with path /login
router.post('/login', user.loginUser);

router.put('/forgot-password', user.forgotPassword);

module.exports = router;


