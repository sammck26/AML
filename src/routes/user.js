const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const viewInventoryController = require('../controllers/view_inventory.js');

// User-related routes
router.get('/dashboard', userController.getDashboard);  // URL: /user/dashboard
router.get('/profile', userController.getProfile);      // URL: /user/profile
router.get('/inventory', viewInventoryController.viewInventory);
router.get('/wishlist', userController.getWishlist, viewInventoryController.viewWishlist);
router.get('/borrowed_media', userController.getBorrowed, viewInventoryController.viewBorrowed);
module.exports = router;
