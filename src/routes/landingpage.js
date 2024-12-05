// src/routes/landing.js
const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingpage.js');
const userController = require('../controllers/user.js');
const inventoryController = require('../controllers/view_inventory.js');

// Route to render the landing page
router.get('/', landingController.getLandingPage);
router.get('/landingpage/login', landingController.getLoginPage);
router.get('/landingpage/register', landingController.getRegisterPage);
router.post('/landingpage/register', userController.registerCustomer);
router.get("/landingpage/inventory", inventoryController.viewGuestInventory, inventoryController.searchMedia);
router.get("/landingpage/view_media/:id", inventoryController.viewGuestMedia);
router.get("/landingpage/search", inventoryController.searchGuestMedia);


module.exports = router;