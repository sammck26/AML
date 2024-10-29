// src/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const viewInventoryController = require('../controllers/view_inventory.js');

// User-related routes
router.get('/dashboard', userController.getDashboard);  // URL: /user/dashboard
router.get('/profile', userController.getProfile);
router.get('/inventory', viewInventoryController.viewInventory);

module.exports = router;
//console.log('User routes loaded');