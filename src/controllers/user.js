const {Media} = require("../../db/models/inventory.js");
exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};

exports.getDashboard = (req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    const userData = { name: "User", role: "customer" };

  res.render('user/user_dashboard', {user: userData, activePage: "dashboard"}); 
    //console.log('User dashboard data sent');
    
  };

  
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
