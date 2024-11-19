const {Media} = require("../../db/models/inventory.js");
const Borrowed = require('../../db/models/borrowed.js');
const Customer = require('../../db/models/customer.js');
exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};

exports.getDashboard = async(req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    //res.render('user/user_dashboard', {user: userData, activePage: "dashboard"}); 
    try {
      const customerinfo = await Customer.find().populate({
        path: "role_id",
        select: "role_description",
      }); 
      const userId = req.query.user_id; // Retrieve the user_id from the query parameters

      // Fetch the user from the database
    const user = await Customer.findOne({ user_id: userId });
    req.user = user;

      // Render the dashboard and pass the user data
    res.render('user/user_dashboard', { user});
    console.log('User dashboard data sent');
     // Set the role to customer
    
    }
    catch (error) {
      console.error("Error fetching media items:", error);
      res.status(500).send("An error occurred while fetching inventory");
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
