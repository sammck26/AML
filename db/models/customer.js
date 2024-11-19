const connectDB = require("./db.js"); // Import the connection promise
const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  branch_id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  phone_no: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
});

const Customer = mongoose.model("customers", CustomerSchema);

(async () => {
  try {
    const db = await connectDB; // Wait for the connection to be ready
    const collections = await db.connection.db.listCollections().toArray();
    const customerCollection = collections.find((c) => c.name === "customers");

    if (customerCollection) {
      console.log("Customer collection found:", customerCollection.name);
    } else {
      console.log("Customer collection not found.");
    }

    // Fetch all customers
    const customers = await Customer.find();
    console.log("Customers:", customers);
  } catch (error) {
    console.error("Error while accessing customer collection:", error);
  }
})();

// Customer Schema

const RoleSchema = new mongoose.Schema({
  role_description: { type: String, required: true },
});
const Role = mongoose.model("Role", RoleSchema);

module.exports = { Customer, Role };
