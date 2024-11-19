const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const viewInventoryController = require('../controllers/view_inventory.js');

// User-related routes
console.log("entered routes")
router.get('/dashboard', userController.getDashboard);  // URL: /user/dashboard
router.get('/profile', userController.getProfile);      // URL: /user/profile
router.get('/inventory', viewInventoryController.viewInventory);
router.get('/wishlist', userController.getWishlist, viewInventoryController.viewWishlist);
router.get('/borrowed_media', userController.getBorrowed, viewInventoryController.viewBorrowed);
router.get('/view_media/:id', userController.viewMedia); // bulit to pass the id of the media item to the view_media page
router.post('/borrow_media/:id', userController.borrow_media); // built to handle the borrowing of media items

module.exports = router;
