const connectDB = require("./db.js");
const mongoose = require("mongoose");

// Customer Schema
const CustomerSchema = new mongoose.Schema({
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true},
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  phone_no: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
  borrowed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Borrowed" }],
  //branch : { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

const StaffSchema = new mongoose.Schema({
  branch_id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  phone_no: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  branch : { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

// Role Schema
const RoleSchema = new mongoose.Schema({
  role_description: { type: String, required: true },
});

const Customer = mongoose.model("Customer", CustomerSchema);
const Staff = mongoose.model("Staff", StaffSchema);
const Role = mongoose.model("Role", RoleSchema);




module.exports = {Customer, Role, Staff};
