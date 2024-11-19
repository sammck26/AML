// src/routes/landing.js
const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingpage.js');

// Route to render the landing page
router.get('/', landingController.getLandingPage);
<<<<<<< HEAD
router.get('/registration', landingController.getRegistration);
=======
router.get('/landingpage/login', landingController.getLoginPage);
router.get('/landingpage/register', landingController.getRegisterPage);

>>>>>>> finTest

module.exports = router;