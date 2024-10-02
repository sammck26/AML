const express = require('express');
const app = express();


app.set('view engine', 'ejs');

// Set the views directory
app.set('views', './views');

// Middleware for json
app.use(express.json());

// Use routes
const userRoutes = require('./routes/user.js');
app.use('/user', userRoutes);  // puts user related routes under /user



module.exports = app;  // Export the app setup
