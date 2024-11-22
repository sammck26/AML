const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/branch_librarian.js');
const viewInventoryController = require("../controllers/view_inventory.js");
const branch_librarianController = require("../controllers/branch_librarian");
const app = require('../app.js');

// Librarian dashboard route
router.get('/dashboard', librarianController.getLibrarianDashboard);
router.get('/librarianInventory', viewInventoryController.viewLibrarianInventory);
router.get('/inventory/new', branch_librarianController.showAddForm); // Route for the add form
router.post("/inventory/new", branch_librarianController.addBook);     // Route to handle adding
router.get("/inventory/update/:id", branch_librarianController.showUpdateForm); // Route for the update form
router.post("/inventory/update/:id", branch_librarianController.updateBook);    // Route to handle updating


console.log('Branch librarian routes loaded');

module.exports = router;