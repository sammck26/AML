const {Media} = require("../../db/models/inventory.js");
const Borrowed = require('../../db/models/borrowed.js');
const {Customer} = require('../../db/models/customer.js');
console.log("Customer Model:", Customer);

exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.query._id;
    if (!userId) {
      return res.status(400).send("Missing user_id in query parameters");
    }

    const user = await Customer.findOne({ _id: userId }).populate({
      path: "role_id",
      select: "role_description",
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("user/user_dashboard", {
      user,
      activePage: "dashboard",
    });

    console.log("User dashboard data sent:", user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
};

  
    //console.log('User dashboard data sent');
    
  

  
exports.viewMedia = async (req, res) => {
  console.log("View Media function triggered"); // Log at the start
  const userId = req.query._id;

  // Check if userId is provided
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing user_id in query parameters" });
  }

  let user;
  try {
    // Fetch the user and populate role_id
    user = await Customer.findOne({ _id: userId }).populate({
      path: "role_id",
      select: "role_description",
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching user" });
  }

  try {
    // Fetch the media item by ID
    const mediaItem = await Media.findById(req.params.id);

    if (!mediaItem) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    }
    console.log("User being passed to EJS:", user);
    // Render the view with media item and user data
    res.render("user/view_media", {
      mediaItem,
      user,
      activePage: "view_media",
    });
  } catch (error) {
    console.error("Error fetching media item:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving media item" });
  }
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
