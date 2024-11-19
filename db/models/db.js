const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

mongoose.set("debug", true);

const connectDB = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");
    return mongoose; // Return the mongoose instance when connected
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
    throw err;
  });

module.exports = connectDB; // Export the promise
