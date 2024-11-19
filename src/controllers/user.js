const {Media} = require("../../db/models/inventory.js");
const Borrowed = require('../../db/models/borrowed.js');
const Customer = require('../../db/models/customer.js');
exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};

exports.getDashboard = async (req, res) => {
  try {
    // Retrieve user_id from query parameters
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).send("Missing user_id in query parameters");
    }

    // Fetch the customer data from the database, populating the role description
    const user = await Customer.findOne({ user_id: userId }).populate({
      path: "role_id", // This should match the field in your schema
      select: "role_description", // Only fetch the role description
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach the user object to the request (if needed)
    req.user = user;

    // Render the dashboard with the user data
    res.render("user/user_dashboard", {
      user,
      activePage: "dashboard", // Pass the active page for the view
    });

    console.log("User dashboard data sent:", user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
};

  
    //console.log('User dashboard data sent');
    
  

  
exports.viewMedia = async(req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    const userData = { name: "User", role: "customer" };
    try {
      const mediaItem = await Media.findById(req.params.id); // Fetch the media item by ID
  
      if (!mediaItem) {
        return res.status(404).send("Media not found");
      }
  
      // Render the view with media item data
      res.render('user/view_media', { mediaItem, user: userData, activePage: "view_media" });
    } catch (error) {
      console.error("Error fetching media item:", error);
      res.status(500).send("Error retrieving media item");
    }  
    //console.log('User dashboard data sent');
    
  };

exports.getWishlist = (req, res, next) => {
  const userData = { name: "User", role: "customer" }; 
  req.userData = userData; // Pass data to next controller
  next();
};


exports.getBorrowed = (req, res, next) => {
  const userData = { name: "User", role: "customer" };
  req.userData = userData; // Pass data to next controller
  next();
};

exports.borrow_media = async (req, res) => {
  const { media_id } = req.body;
  const user_id = req.user._id; 

  try {
      // Call the model's borrowMedia method
      await Borrowed.borrowMedia(media_id, user_id);

      res.status(200).json({ success: true, message: 'Media borrowed successfully!' });
  } catch (error) {
      console.error("Error borrowing media in controller:", error);
      res.status(500).json({ success: false, message: 'Failed to borrow media.' });
  }
};
