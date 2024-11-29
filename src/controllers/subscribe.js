const  {Media}  = require("../../db/models/inventory.js");
const { Customer } = require("../../db/models/customer.js");
const Borrowed = require("../../db/models/borrowed.js");


exports.subscribe = async (req, res) => {
    const user = req.user; // Retrieve user data
    try {
        res.render("user/subscribe", { user, activePage: "subscribe" });
    } catch (error) {
        console.error("Error rendering subscription page:", error);
        res.status(500).send("An error occurred while rendering the subscription page.");
    }
};