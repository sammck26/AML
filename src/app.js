const express = require('express');
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Define the views folder (this should be the folder, not a specific file)
app.set('views', './views');

// Middleware for parsing JSON requests
app.use(express.json());

// Use routes (ensure the path is correct for your user routes file)
const userRoutes = require('./routes/user.js');
app.use('/user', userRoutes);  // All user-related routes will now be prefixed with "/user"



module.exports = app;  // Export the app so it can be used by server.js
