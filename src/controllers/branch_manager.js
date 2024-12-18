const { Media, Genre } = require("../../db/models/inventory.js");
const { Customer, Staff } = require("../../db/models/customer.js");
const Borrowed = require("../../db/models/borrowed.js");

exports.getManagerDashboard = (req, res) => {
  try {
    const user = req.user; // User is already fetched by middleware
    res.render("branch_manager/manager_dashboard", {
      user,
      activePage: "dashboard",
    });
    console.log("User dashboard data sent:", user);
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("An error occurred while rendering the dashboard");
  }
};


