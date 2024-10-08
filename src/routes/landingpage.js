// src/routes/landing.js
const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingpage.js');

// Route to render the landing page
router.get('/', landingController.getLandingPage);


module.exports = router;