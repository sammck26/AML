const express = require("express");
const router = express.Router();
const managerController = require("../controllers/branch_manager.js");


router.get('/dashboard', managerController.getManagerDashboard);
//router.get('/branches', managerController.viewBranches);


module.exports = router;