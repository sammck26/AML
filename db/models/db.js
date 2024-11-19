const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URI, { //uses mongoose to connect 
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas with Mongoose");
}).catch((err) => {
  console.error("Failed to connect to MongoDB Atlas:", err);
});

module.exports = mongoose; // Export Mongoose to be used across other files
