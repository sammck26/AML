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
exports.markAsReturned = async (req, res) => {
  const borrowedId = req.params.id; // Borrowed item ID from the URL
  const userId = req.user._id; // User ID from the logged-in user

  try {
    // Fetch the borrowed document to get the media_id
    const borrowedItem = await Borrowed.findById(borrowedId);

    if (!borrowedItem) {
      return res.status(404).send("Borrowed item not found");
    }

    // Update the borrowed item's date_returned field
    borrowedItem.date_returned = new Date();
    await borrowedItem.save();

    // Update the media's quantity (increase by 1)
    const updatedMedia = await Media.findByIdAndUpdate(
      borrowedItem.media_id, // Use the media_id from the borrowed document
      { $inc: { quant: 1 } }, // Increment quantity by 1
      { new: true } // Return the updated document
    );

    if (!updatedMedia) {
      return res.status(404).send("Associated media not found.");
    }

    console.log("Media quantity increased:", updatedMedia);

    // Remove the borrowed item from the customer's borrowed array
    await Customer.findByIdAndUpdate(userId, {
      $pull: { borrowed: borrowedId },
    });

    console.log("Borrowed item removed from customer's list");

    // Redirect to the borrowed media page with a success message
    res.redirect(`/user/borrowed_media?_id=${userId}&status=success&message=Media returned successfully`);
  } catch (error) {
    console.error("Error marking as returned:", error);
    res.status(500).send("An error occurred while marking the media as returned");
  }
};


// exports.getBorrowed = (req, res, next) => {
//   user = req.user;
//   req.userData = userData; // Pass data to next controller
//   next();
// };

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
  const { media_id } = req.body; 
  const user = req.user; // `req.user` contains the user fetched by middleware

  try {
    console.log("Request body:", req.body); 

    
    const borrowedMedia = await Borrowed.borrowMedia(media_id, user._id);

    // if theres no media
    if (!borrowedMedia) {
      return res.redirect(
        `/user/view_media/${media_id}?_id=${user._id}&status=error&message=Unable to borrow media`
      );
    }

    // go abck to same page with a success message
    return res.redirect(
      `/user/view_media/${media_id}?_id=${user._id}&status=success&message=Media borrowed successfully`
    );
  } catch (error) {
    console.error("Error borrowing media:", error);
    return res.redirect(
      `/user/view_media/${media_id}?_id=${user._id}&status=error&message=An error occurred while borrowing media`
    );
  }
};

