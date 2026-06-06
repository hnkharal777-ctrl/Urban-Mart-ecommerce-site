const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Render pages
router.get('/register', (req, res) => res.render('register', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null }));

// Auth actions
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;