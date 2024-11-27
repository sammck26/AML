const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingpage.js');

// Route to render the landing page
router.get('/', landingController.getLandingPage);
router.get('/register', landingController.getRegisterPage);

module.exports = router;