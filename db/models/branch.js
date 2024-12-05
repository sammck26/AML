
const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
    branch_description: { type: String, required: true },
    city: { type: String, required: true },
    hours: { type: String, required: true },
  });

const Branch = mongoose.model("Branch", BranchSchema);

module.exports = { Branch }; // Export branch models