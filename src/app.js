const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Customer } = require('../db/models/customer'); // Import the Customer model
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // means we can pass shit through fomrs
// Middleware: Fetch User with Role
const fetchUserWithRole = async (req, res, next) => {
  try {
    const userId = req.query._id;
    if (!userId) {
      return res.status(400).send("Missing user_id in query parameters");
    }

    const user = await Customer.findOne({ _id: userId }).populate({
      path: "role_id",
      select: "role_description",
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user; // Attach user to the request object
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

// Use routes
app.use(express.urlencoded({ extended: true }));
app.use('/', landingRoutes);
app.use('/user', fetchUserWithRole, userRoutes); // Apply middleware for all /user routes
app.use('/branch_librarian', librarianRoutes);

module.exports = app; // Export the app setup
