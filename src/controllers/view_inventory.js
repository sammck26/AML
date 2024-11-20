const { Media } = require("../../db/models/inventory.js");
const { Customer } = require("../../db/models/customer.js");

exports.viewInventory = async (req, res) => {
  //const userData = req.user;
  const user = req.user;
  try {
    const mediaItems = await Media.find().populate({
      path: "genre_id",
      select: "genre_description",
    }); // Fetch and populate genre_id with genre_description
    
    res.render("user/show_media.ejs", {
      items: mediaItems,
      user,
      activePage: 'inventory',
    }); // Render the view with populated items
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).send("An error occurred while fetching inventory");
  }
};

exports.viewLibrarianInventory = async (req, res) => {
  const userData = { name: "Librarian", role: "librarian" }; ;

  try {
    const mediaItems = await Media.find().populate({
      path: "genre_id",
      select: "genre_description",
    }); // Fetch and populate genre_id with genre_description

    res.render("branch_librarian/show_media.ejs", {
      items: mediaItems,
      user: userData,
      activePage: 'inventory',
    }); // Render the view with populated items
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

exports.viewBorrowed = (req, res) => {
  const userData = req.userData;
  const borrowedData = [
    { title: "Borrowed Book 1", author: "Author A", status: "Available" },
    { title: "Borrowed Book 2", author: "Author B", status: "Unavailable" },
    { title: "Borrowed Book 3", author: "Author C", status: "Available" },
  ];

  res.render("user/borrowed_media", {
    inventory: borrowedData,
    user: userData,
    activePage: "borrowed_media",
  });
};

exports.viewWishlist = async (req, res) => {
  const user = req.user;

  try {
    // Populate the user's wishlist with media items and their genres
    console.log(user.wishlist);
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
