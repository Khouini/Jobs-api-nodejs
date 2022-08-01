const express = require('express');
const router = new express.Router();
const { login, register } = require('../controllers/auth');

router.post('/login', login);
router.post('/register', register);

module.exports = router;
