const express = require('express');
const router = express.Router();

const accountantController = require('../controllers/accountant.js');
const app = require('../app.js');

// Librarian dashboard route
router.get('/dashboard', accountantController.getaccountDashboard);

// Route to fetch and display subscriptions


// Route to update a subscription
router.post('/subscriptions/update/', accountantController.updateSubscription);

// Route to delete a subscription
router.post('/subscriptions/delete/', accountantController.deleteSubscription);

module.exports = router;