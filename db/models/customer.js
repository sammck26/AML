const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    const customerCollection = collections.find((c) => c.name === "Customer");
    if (customerCollection) {
        console.log("Customer collection found:", customerCollection.name);
    } else {
        console.log("Customer collection not found.");
    }
})
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

// Customer Schema
const CustomerSchema = new mongoose.Schema({
  //_id: { type: mongoose.Schema.Types.ObjectId,}, // Unique identifier for the user
  branch_id: { type: Number, required: true }, // Branch the customer belongs to
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  phone_no: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: {type: mongoose.Schema.Types.ObjectId, ref: "Role"},
});

const RoleSchema = new mongoose.Schema({
  role_description: { type: String, required: true }, 
});

// Export Customer model
const Customer = mongoose.model("Customer", CustomerSchema);
const Role = mongoose.model("Role", RoleSchema);
module.exports = Customer,Role;
