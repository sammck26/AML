const  {Customer}  = require('../../db/models/customer.js');
const Subscription = require('../../db/models/subscription.js');
//const Branch = require('../../db/models/branch.js');



exports.getaccountDashboard = async (req, res) => {
    try {
        const user = req.user; // User is already fetched by middleware
        const currentDate = new Date(); // Current date for calculations

        // Fetch subscriptions and populate related details
        const subscriptions = await Subscription.find()
            .populate({
                path: 'user_id', // Populate user data from the Customer model
                model: 'Customer',
                select: 'first_name last_name active branch_id',
                populate: {
                    path: 'branch_id',
                    model: 'Branch',
                    select: 'city branch_description',
                },
            })
            .exec();

            let totalPayments = 0;
            let totalPaidSoFar = 0; // Total paid across all subscriptions
            let totaloutstandingBalances = 0;
            const paymentMethods = new Set(); // Collect unique payment methods
            
            const enrichedSubscriptions = subscriptions.map((subscription) => {
                const startDate = new Date(subscription.start_date);
                const endDate = new Date(subscription.end_date);
                
                // Calculate total subscription amount
                const totalMonths =
                    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (endDate.getMonth() - startDate.getMonth());
                const totalAmount = totalMonths * 10; // sub is £10 a month
            
                // Calculate amount paid so far
                const effectiveEndDate = new Date(subscription.active ? currentDate : subscription.end_date);
                const monthsPaid =
                    (effectiveEndDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (effectiveEndDate.getMonth() - startDate.getMonth());
                const monthsPaidSoFar = Math.min(monthsPaid, totalMonths); // Cap monthsPaid to totalMonths
                const amountPaid = monthsPaidSoFar * 10; // Calculate the total paid
            
                // Calculate outstanding balances
                const outstandingBalances = totalAmount - amountPaid;
            
                // Accumulate totals
                totalPayments += totalAmount;
                totalPaidSoFar += amountPaid;
                totaloutstandingBalances += outstandingBalances;
            
                // Example payment methods
                paymentMethods.add('Credit Card');
                paymentMethods.add('Debit Card');
                paymentMethods.add('PayPal');
            
                return {
                    ...subscription.toObject(),
                    totalAmount,
                    amountPaid,
                    outstandingBalances,
                    branch: subscription.user_id?.branch_id,
                    active: subscription.user_id?.active || false,
                    status: new Date(subscription.end_date) < currentDate ? 'Overdue' : 'On Time',
                };
            });

        totaloutstandingBalances = totalPayments - totalPaidSoFar; // Calculate outstanding balances
        
        console.log("Query parameters:", req.query);
        res.render('accountant/accountant_dashboard', {
            user,
            subscriptions: enrichedSubscriptions,
            paymentMethods: Array.from(paymentMethods), // Convert set to array
            totalPayments,
            totalPaidSoFar,
            totaloutstandingBalances,
            activePage: 'dashboard',
            status: req.query.status || null,
            message: req.query.message || null,
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).send('An error occurred while rendering the dashboard');
    }
};


// Update subscription handler
exports.updateSubscription = async (req, res) => {
    const user = req.user;
    const subscriptionId = req.params.id;
    const updateData = req.body; // Data sent from the client

    console.log("Received update request for subscription:", subscriptionId);
    console.log("Update data:", updateData);

    try {
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        // Automatically set end_date to current date if active is false
        if (updateData.active === "false" || updateData.active === false) {
            updateData.end_date = new Date(); // Current date
        }

        // Update the subscription document
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: "Subscription not found." });
        }

        // Update the 'active' status in the Customer document
        if (updateData.active !== undefined) {
            await Customer.findByIdAndUpdate(
                updatedSubscription.user_id,
                { active: updateData.active }, // Update the 'active' field
                { new: true }
            );
        }

        console.log("Subscription updated successfully:", updatedSubscription);
        return res.redirect(`/accountant/dashboard?_id=${user._id}&status=success&message=Subscription updated successfully`);
    } catch (error) {
        console.error("Error updating subscription:", error);
        return res.redirect(`/accountant/dashboard?_id=${user._id}&status=failure&message=Subscription failed to update`);
    }
};


