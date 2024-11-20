const {Media} = require("../../db/models/inventory.js");
const Borrowed = require('../../db/models/borrowed.js');
const {Customer} = require('../../db/models/customer.js');
//console.log("Customer Model:", Customer);

exports.getProfile = (req, res) => {
  //const userData = { name: "User", role: "customer" }; // Sample data
  try{
  //const userId = req.params.id;
  const user = req.user;
  res.render("user/view_profile", { user, activePage: "profile" });
  } 
  catch (error) {
    console.error("Error rendering profile:", error);
    res.status(500).send("An error occurred while rendering the profile");
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = req.user; // User is already fetched by middleware
    res.render("user/user_dashboard", {
      user,
      activePage: "dashboard",
    });
    console.log("User dashboard data sent:", user);
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("An error occurred while rendering the dashboard");
  }
};
    //console.log('User dashboard data sent');
exports.viewMedia = async(req, res) => { 
  const user = req.user;
    //const userData = {};  // will fetch user dashboard data from database
    //const userData = { name: "User", role: "customer" };
    try {
      const mediaItem = await Media.findById(req.params.id); // Fetch the media item by ID
  
      if (!mediaItem) {
        return res.status(404).send("Media not found");
      }
  
      // Render the view with media item data
      res.render('user/view_media', { mediaItem, user, activePage: "view_media" });
    } catch (error) {
      console.error("Error fetching media item:", error);
      res.status(500).send("Error retrieving media item");
    }  
    //console.log('User dashboard data sent');
    
  };

// exports.getWishlist = (req, res) => {
//   //const userData = { name: "User", role: "customer" }; 
//   try{
//   const user = req.user;
//   res.render("user/wishlist", { user, activePage: "wishlist" });
//   }
//   catch (error) {
//     console.error("Error fetching wishlist:", error);
//     res.status(500).send("An error occurred while fetching the wishlist");
//   }
  

  
// };


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
