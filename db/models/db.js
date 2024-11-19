const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, ".env") });

mongoose.set("strictQuery", true); // Optional: Adjust query strictness if needed

const connectDB = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    return mongoose; // Return the mongoose instance for reuse
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    throw err;
  });

module.exports = connectDB;
