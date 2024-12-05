const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Customer, Staff } = require('../db/models/customer'); // Import the Customer model
const { Media } = require("../db/models/inventory.js");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // means we can pass shit through fomrs
// Middleware: Fetch User with Role
const bodyParser = require("body-parser");
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());
const fetchUserWithRole = async (req, res, next) => {
  try {
    const userId = req.query._id;
    if (!userId) {
      return res.status(400).send("Missing user_id in query parameters");
    }

    //try to find user within customoer
    let user = await Customer.findOne({ _id: userId }).populate({
      path: "role_id",
      select: "role_description",
    });

    //search staff if user isn't a customer
    if (!user) {
      user = await Staff.findOne({ _id: userId }).populate({
        path: "role_id",
        select: "role_description",
      });
    }

    //if no user matches, display error
    if (!user) {
      return res.status(404).send("User not found in Customer or Staff collections");
    }
    req.user = user;
    console.log("Populated User:", user);
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("An error occurred while fetching the user");
  }
};


// Set the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../styles')));

// Middleware for parsing JSON
app.use(express.json());

// Import and use routes
const librarianRoutes = require('./routes/branch_librarian.js');
const landingRoutes = require('./routes/landingpage.js');
const userRoutes = require('./routes/user.js');
const managerRoutes = require('./routes/branch_manager.js');
const accountantRoutes = require('./routes/accountant.js');

// Use routes
app.use(express.urlencoded({ extended: true })); // so we can pass stuff through URL
app.use('/', landingRoutes);
app.use('/user', fetchUserWithRole, userRoutes); // Apply middleware for all /user routes
app.use('/branch_librarian', fetchUserWithRole, librarianRoutes);
app.use('/branch_manager', fetchUserWithRole, managerRoutes);
app.use('/accountant', fetchUserWithRole, accountantRoutes);

module.exports = app; // Export the app setup
