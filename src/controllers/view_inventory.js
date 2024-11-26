const { Media } = require("../../db/models/inventory.js");
const { Customer } = require("../../db/models/customer.js");
const Borrowed = require("../../db/models/borrowed.js");

exports.viewInventory = async (req, res) => {
  const user = req.user; // Get the logged-in user's data from middleware

  try {
    // now we fetching only the medai that is in theusers branch
    const mediaItems = await Media.find({ branch: user.branch })
      .populate({
        path: "genre_id",
        select: "genre_description",
      }); // Populate genre_id with genre_description

    res.render("user/show_media.ejs", { //shoving all that to the view
      items: mediaItems, 
      user,
      activePage: 'inventory',
    });
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).send("An error occurred while fetching inventory");
  }
};


exports.viewLibrarianInventory = async (req, res) => {
  const user = req.user;

  try {
    // Fetch media items for the staff member's branch
    const mediaItems = await Media.find({ branch: user.branch }).populate({
      path: "genre_id",
      select: "genre_description",
    });

    res.render("branch_librarian/show_media.ejs", {
      items: mediaItems,
      user,
      activePage: 'inventory',
    });
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).send("An error occurred while fetching inventory");
  }
};

// hadnles viewing the inventory
/*exports.viewInventory = (req, res) => {
    const userData = req.user;

    res.render('user/show_media', { inventory: inventoryItems, user: userData, activePage: "inventory" });
};

//this is shitty mock data
/*const inventoryData = [
    { title: "Book 1", author: "Author A", status: "Available" },
    { title: "Book 2", author: "Author B", status: "Unavailable" },
    { title: "Book 3", author: "Author C", status: "Available" }
];*/

exports.viewBorrowed = async(req, res) => {

 
  const user = req.user;
  
  try {
      // Fetch all borrowed media for the current user
    const borrowedItems = await Borrowed.find({ user_id: user._id })
      .populate({
        path: "media_id",
        select: "media_title author genre_id quant", 
        populate: {
          path: "genre_id",
          select: "genre_description", // Populate genre details
        },
      })
      .exec();
  
    res.render("user/borrowed_media.ejs", {
      items: borrowedItems,
      user,
      activePage: "borrowed_media",
    });
  } catch (error) {
    console.error("Error fetching borrowed items:", error);
    res.status(500).send("An error occurred while fetching borrowed media");
  }
  
};

exports.viewWishlist = async (req, res) => {
  const user = req.user;

  try {
    // Populate the user's wishlist with media items and their genres
    //console.log(user.wishlist);
    await user.populate({
      path: "wishlist",
      populate: {
        path: "genre_id",
        select: "genre_description",
      },
    });
    
    const wishlistItems = user.wishlist;
    

    res.render("user/wishlist.ejs", {
      items: wishlistItems,
      user,
      activePage: "wishlist",
    });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res.status(500).send("An error occurred while fetching the wishlist");
  }
};



exports.searchMedia = async (req, res) => {
  try {
    const query = req.query.query; // Get the search query from the request
    const user = req.user;
    const mediaResults = await Media.find({
      $or: [
        { media_title: { $regex: query, $options: "i" } }, // Case-insensitive match for title
        { genre_description: { $regex: query, $options: "i" } }, // Case-insensitive match for genre
      ],
    });
    res.render("user/search_results.ejs", { mediaResults, query, activePage: 'inventory', user}); // Pass the results and query to the view
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
