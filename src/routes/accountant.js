const express = require('express');
const router = express.Router();
const app = require('../app.js');
const accountantController = require('../controllers/accountant.js');
console.log("entered accountant routes")

// Librarian dashboard route
router.get('/dashboard', accountantController.getaccountDashboard);

// Route to fetch and display subscriptions


// Route to update a subscription
router.post('/subscriptions/update/:id', (req, res, next) => {
    console.log("Subscription ID in route:", req.params.id);
    next(); // Pass control to the controller
}, accountantController.updateSubscription);




module.exports = router;