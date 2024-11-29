const  {Media}  = require("../../db/models/inventory.js");
const { Customer } = require("../../db/models/customer.js");
const Borrowed = require("../../db/models/borrowed.js");
const Subscription = require('../../db/models/subscription.js');
const { post } = require("../app.js");
const { start } = require("repl");

exports.renderSubscriptionForm = (req, res) => {
    const user = req.user; // Assuming user middleware sets this
    res.render('user/subscribe', {
        user,
        activePage: 'subscribe'
    });
};



exports.subscribe = async (req, res) => {
    const {
        end_date,
        full_name,
        email,
        address,
        county,
        postcode,
        card_number,
        exp_month,
        exp_year,
        cvv,
    } = req.body;

    const user = req.user; // Assuming user is populated by middleware

    try {
        // Validate input
        if (!card_number || !cvv || !exp_month || !exp_year || !full_name || !email || !end_date) {
            throw new Error("All fields are required");
        }

        // Create the subscription and update customer status
        const subscription = await Subscription.createSubscription(
            user._id, // Pass user ID
            full_name,
            email,
            address,
            county,
            postcode,
            card_number,
            exp_month,
            exp_year,
            cvv,
            new Date(), // start_date defaults to now
            new Date(end_date)
        );

        // Render the same page with a success message
        res.status(200).render("user/subscribe_status", {
            user,
            status: "success",
            message: "Your subscription was successful!",
            subscription,
            full_name,
            end_date,
            activePage: "subscribe",
        });
    } catch (error) {
        console.error("Error creating subscription:", error);

        // Render the same page with a failure message
        res.status(500).render("user/subscribe_status", {
            user,
            status: "failure",
            message: error.message || "An error occurred while processing your subscription.",
            activePage: "subscribe",
        });
    }
};
