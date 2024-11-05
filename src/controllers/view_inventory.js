//this is shitty mock data
const inventoryData = [
    { title: "Book 1", author: "Author A", status: "Available" },
    { title: "Book 2", author: "Author B", status: "Unavailable" },
    { title: "Book 3", author: "Author C", status: "Available" }
];

// hadnles viewing the inventory
exports.viewInventory = (req, res) => {
    const userData = req.user;

    res.render('user/show_media', { inventory: inventoryData, user: userData, activePage: "inventory" });
};

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
