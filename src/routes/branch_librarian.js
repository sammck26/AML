const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/branch_librarian.js');

// Librarian dashboard route
router.get('/dashboard', librarianController.getLibrarianDashboard);

console.log('Branch librarian routes loaded');

module.exports = router;