const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

//register a new user
router.post('/register', AuthController.register);

//login an existing user
router.post('/login', AuthController.login);

module.exports = router;