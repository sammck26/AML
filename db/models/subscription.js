const mongoose = require("mongoose");
const { Customer } = require("./customer.js"); // Importing Customer schema to update active status

const SubscriptionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    county: { type: String, required: true },
    postcode: { type: String, required: true },
    card_number: { type: String, required: true }, // Stored as a string for formatting
    exp_month: { type: Number, required: true },
    exp_year: { type: Number, required: true },
    cvv: { type: String, required: true },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, required: true },
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: false }, // garbing the branch
});

// Static method to create a subscription and update customer status
SubscriptionSchema.statics.createSubscription = async function (
    user_id,
    full_name,
    email,
    address,
    county,
    postcode,
    card_number,
    exp_month,
    exp_year,
    cvv,
    start_date,
    end_date
) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create the subscription document
        const newSubscription = new this({
            user_id,
            full_name,
            email,
            address,
            county,
            postcode,
            card_number,
            exp_month,
            exp_year,
            cvv,
            start_date,
            end_date,
        });

        const savedSubscription = await newSubscription.save({ session });

        // Update the customer's active status to true
        const updatedCustomer = await Customer.findByIdAndUpdate(
            user_id,
            { active: true }, // Set the active field to true
            { new: true, session } // Return the updated customer
        );

        if (!updatedCustomer) {
            throw new Error("Failed to update customer status. User not found.");
        }

        await session.commitTransaction();
        session.endSession();

        return savedSubscription;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

module.exports = mongoose.model("Subscription", SubscriptionSchema);
