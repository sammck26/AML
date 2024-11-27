const {Media} = require("../../db/models/inventory.js");
const Borrowed = require('../../db/models/borrowed.js');
const { Customer } = require('../../db/models/customer.js');
const bcrypt = require("bcrypt");
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

// controllers/user.js
exports.addToWishlist = async (req, res) => {
  const { media_id } = req.body;
  
  //console.log("Request body:", req.body);
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `/user/view_media/${media_id}?_id=${user._id}&status=error&message=User not found`
      );
    }

    // Check if the media item is already in the wishlist
    if (user.wishlist.includes(media_id)) {
      return res.redirect(
        `/user/view_media/${media_id}?_id=${user._id}&status=error&message=Media item already in wishlist`
      );
    }

    // Add the media item to the wishlist
    user.wishlist.push(media_id);
    await user.save();

    return res.redirect(
      `/user/view_media/${media_id}?_id=${user._id}&status=success&message=Item added to wishlist`
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.redirect(
      `/user/view_media/${media_id}?_id=${user._id}&status=error&message=An error occurred`
    );
  }
};

exports.deleteFromWishlist = async (req, res) => {
  const userId = req.user?._id || req.query._id; // Retrieve user ID
  const { item_id: mediaId } = req.body; // Retrieve media ID from form body

  try {
    if (!userId || !mediaId) {
      return res.status(400).redirect(
        `/user/wishlist?status=error&message=Invalid user or media ID`
      );
    }

    const user = req.user;

    if (!user) {
      return res.status(404).redirect(
        `/user/wishlist?status=error&message=User not found`
      );
    }

    //console.log("User's wishlist before:", user.wishlist);

    // Check if media ID exists in wishlist
    if (!user.wishlist.some((id) => id.toString() === mediaId.toString())) {
      return res.status(400).redirect(
        `/user/wishlist?_id=${user._id}&status=error&message=Item not in wishlist`
      );
    }

    // Remove the media ID from wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== mediaId.toString()
    );

    //console.log("User's wishlist after:", user.wishlist);

    await user.save();

    // Redirect with success message
    return res.redirect(
      `/user/wishlist?_id=${user._id}&status=success&message=Item removed from wishlist`
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).redirect(
      `/user/wishlist?status=error&message=An error occurred`
    );
  }
};

exports.borrowMedia = async (req, res) => {
  const { media_id  } = req.body; 
  const user_id = req.user; 
  try {
    console.log("Request body:", req.body); 
      // Logic to handle borrowing media
      const borrowedMedia = await Borrowed.borrowMedia(media_id, user_id);
      
      res.status(200).json({ success: true, message: 'Media borrowed successfully!' });
  } catch (error) {
      console.error("Error borrowing media:", error);
      res.status(500).json({ success: false, message: 'Failed to borrow media.' });
  }
};

exports.registerCustomer = async (req, res) => {
  const {
    branch_id,
    first_name,
    last_name,
    date_of_birth,
    phone_no,
    email,
    password,
    role_id,
  } = req.body;

  try {
    //require inputs
    if (
      !branch_id ||
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !phone_no ||
      !email ||
      !password ||
      !role_id
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //check if user is already in the database
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use." });
    }

    //hash pass for security
    const hashedPassword = await bcrypt.hash(password, 10);

    //create customer
    const newCustomer = new Customer({
      branch_id,
      first_name,
      last_name,
      date_of_birth,
      phone_no,
      email,
      password: hashedPassword,
      role_id, // Assign the role (this should be an ObjectId from the Role model)
      wishlist: [], //initialise empty array
      borrowed: [],
    });

    await newCustomer.save();
    // Redirect to login
    return res.redirect(
      `/landingpage/login`
    );
  } catch (error) {
    console.error("Error registering customer:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the customer." });
  }
};