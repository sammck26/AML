const Subscription = require('../../db/models/subscription.js'); // Import Subscription model
const { Customer } = require('../../db/models/customer.js'); // Optional: Link to customers if needed

exports.getaccountDashboard = async (req, res) => {
    try {
      const user = req.user; // Current logged-in user
  
      // Fetch subscriptions, populate customer, and branch details
      const subscriptions = await Subscription.find()
        .populate({
          path: 'user_id', // Populate user data from the Customer model
          populate: { path: 'branch_id', select: 'city' }, // Populate branch details
        })
        .exec();
  
      // Calculate total subscription amounts
      const enrichedSubscriptions = subscriptions.map(subscription => {
        const startDate = new Date(subscription.start_date);
        const endDate = new Date(subscription.end_date);
        const months =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        const totalAmount = months * 10; // Assuming £10 per month
  
        return {
          ...subscription.toObject(),
          totalAmount, // Add calculated total amount
          branch: subscription.user_id.branch_id, // Branch reference
        };
      });
  
      // Render the dashboard with enriched subscription data
      res.render('accountant/accountant_dashboard', {
        user,
        subscriptions: enrichedSubscriptions, // Pass enriched subscriptions
        activePage: 'dashboard',
      });
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      res.status(500).send('An error occurred while rendering the dashboard');
    }
  };
  
  

// Controller to update a subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { _id } = req.params; // Subscription ID
    const { end_date, plan } = req.body; // Fields to update

    await Subscription.findByIdAndUpdate(
      _id,
      { end_date, plan },
      { new: true } // Return the updated document
    );

    res.redirect('/accountant/subscriptions'); // Redirect to subscriptions page
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).send('An error occurred while updating the subscription.');
  }
};

// Controller to delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { _id } = req.params; // Subscription ID
    await Subscription.findByIdAndDelete(_id); // Remove the subscription

    res.redirect('/accountant/subscriptions'); // Redirect to subscriptions page
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).send('An error occurred while deleting the subscription.');
  }
};
