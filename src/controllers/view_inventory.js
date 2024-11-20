const { Media } = require("../../db/models/inventory.js");

exports.viewInventory = async (req, res) => {
  //const userData = req.user;
  const user =req.user;
  try {
    const mediaItems = await Media.find().populate({
      path: "genre_id",
      select: "genre_description",
    }); // Fetch and populate genre_id with genre_description
    
    res.render("user/show_media.ejs", {
      items: mediaItems,
      user,
      activePage: "show_media",
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
      activePage: "show_media",
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

exports.viewWishlist = (req, res) => {
  const userData = req.userData;
  const wishlistData = [
    { title: "Wishlist Book 1", author: "Author A", status: "Available" },
    { title: "Wishlist Book 2", author: "Author B", status: "Unavailable" },
    { title: "Wishlist Book 3", author: "Author C", status: "Available" },
  ];

  res.render("user/wishlist", {
    inventory: wishlistData,
    user: userData,
    activePage: "wishlist",
  });
};
