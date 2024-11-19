const express = require('express');
const path = require('path');
const app = express();

// ... other middleware and routes

// Middleware to attach user data to the request object

// Set the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
//console.log('Views directory set to:', app.get('views'));  // Debugging statement

console.log('Static folder:', path.join(__dirname, '../styles'));
//app.use('/style.css', express.static(path.join(__dirname, '../styles')));
app.use(express.static(path.join(__dirname, '../styles')));
// Middleware for json
app.use(express.json());



// Use routes
const librarianRoutes = require('./routes/branch_librarian.js'); // Import librarian routes
const landingRoutes = require('./routes/landingpage.js'); // Import landing page routes
const userRoutes = require('./routes/user.js');
app.use('/', landingRoutes);
app.use('/user', userRoutes);  // puts user-related routes under /user
app.use('/branch_librarian', librarianRoutes);  // puts librarian-related routes under /branch_librarian




module.exports = app;  // Export the app setup