const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const viewInventoryController = require('../controllers/view_inventory.js');
const subscriberController = require('../controllers/subscribe.js');
const app = require('../app.js');

// User-related routes
console.log("entered routes")
router.get('/dashboard', userController.getDashboard);  // URL: /user/dashboard
router.get('/subscribe', subscriberController.renderSubscriptionForm);  // renders sub page
router.post('/subscribe', subscriberController.subscribe); //handles when sub is clicked
router.get('/profile', userController.getProfile);      // URL: /user/profile
router.get('/inventory', viewInventoryController.viewInventory, viewInventoryController.searchMedia);
router.get('/wishlist', viewInventoryController.viewWishlist);
router.get('/borrowed_media', viewInventoryController.viewBorrowed);
router.get('/view_media/:id', userController.viewMedia); // bulit to pass the id of the media item to the view_media page
router.post('/borrow_media', userController.borrowMedia);
router.get('/search', viewInventoryController.searchMedia);
router.post('/add_to_wishlist', userController.addToWishlist);
router.post('/mark_returned/:id', userController.markAsReturned);
router.post('/remove_from_wishlist', userController.deleteFromWishlist);

module.exports = router;
