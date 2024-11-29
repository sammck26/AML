const express = require("express");
const router = express.Router();
const managerController = require("../controllers/branch_manager.js");
const viewInventoryController = require("../controllers/view_inventory.js");
const app = require("../app.js");

router.get('/dashboard', managerController.getManagerDashboard);
//router.get('/branches', managerController.viewBranches);


module.exports = router;