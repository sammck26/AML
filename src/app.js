const express = require('express');
const path = require('path');
const app = express();

// Set the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
console.log('Views directory set to:', app.get('views'));  // Debugging statement

// Middleware for json
app.use(express.json());

// Use routes
const userRoutes = require('./routes/user.js');
app.use('/user', userRoutes);  // puts user-related routes under /user

module.exports = app;  // Export the app setup