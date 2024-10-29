const express = require('express');
const path = require('path');
const app = express();

// Set the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
//console.log('Views directory set to:', app.get('views'));  // Debugging statement

console.log('Static folder:', path.join(__dirname, '../styles'));
//app.use('/style.css', express.static(path.join(__dirname, '../styles')));
app.use(express.static(path.join(__dirname, '../styles')));
// Middleware for json
app.use(express.json());



// Use routes
const librarianRoutes = require('./routes/branch_librarian.js'); // Import librarian routes
const landingRoutes = require('./routes/landingpage.js'); // Import landing page routes
const userRoutes = require('./routes/user.js');
app.use('/branch_librarian', librarianRoutes);  // puts librarian-related routes under /branch_librarian
app.use('/', landingRoutes);
app.use('/user', userRoutes);  // puts user-related routes under /user
// Middleware to set a default activePage
app.use((req, res, next) => {
    res.locals.activePage = ""; // Default to empty
    next();
});
// Landing page route
app.get('/', (req, res) => {
    res.locals.activePage = "landing"; // Set active page for landing
    res.render("landing");
});

module.exports = app;  // Export the app setup