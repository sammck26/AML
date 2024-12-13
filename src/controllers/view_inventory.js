const  {Media}  = require("../../db/models/inventory.js");
const { Customer } = require("../../db/models/customer.js");
const Borrowed = require("../../db/models/borrowed.js");

exports.viewInventory = async (req, res) => {
  const user = req.user; // Get the logged-in user's data from middleware
  const { page = 1, limit = 10 } = req.query; // Default page is 1, and default limit is 10 items per page

  try {
    // Fetch total count of media items for the user's branch
    const totalItems = await Media.countDocuments({ branch: user.branch_id });

    // Fetch media items for the current page
    const mediaItems = await Media.find({ branch: user.branch_id })
      .populate({
        path: "genre_id",
        select: "genre_description",
      })
      .skip((page - 1) * limit) // Skip items for previous pages
      .limit(parseInt(limit)); // Limit to the number of items per page

    // Calculate total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    res.render("user/show_media.ejs", {
      // Render the media items with pagination details
      items: mediaItems,
      user,
      activePage: "inventory",
      currentPage: parseInt(page), // Current page number
      totalPages, // Total number of pages
      limit: parseInt(limit), // Pass limit to the view
    });
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).send("An error occurred while fetching inventory");
  }
};

exports.viewGuestInventory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page is 1, and default limit is 10 items per page
  const defaultUser = {
    role_id: {
      role_description: "guest",
    },
  };
  try {
    // Fetch total count of all media items
    const totalItems = await Media.countDocuments();

    // Fetch all media items for the current page
    const mediaItems = await Media.find()
      .populate({
        path: "genre_id",
        select: "genre_description",
      })
      .skip((page - 1) * limit) // Skip items for previous pages
      .limit(parseInt(limit)); // Limit to the number of items per page

    // Calculate total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    res.render("landingpage/show_media.ejs", {
      // Render the media items with pagination details
      items: mediaItems,
      user: defaultUser, // No user since this is for guests
      activePage: "guest_inventory",
      currentPage: parseInt(page), // Current page number
      totalPages, // Total number of pages
      limit: parseInt(limit), // Pass limit to the view
    });
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).send("An error occurred while fetching inventory");
  }
};

exports.viewGuestMedia = async (req, res) => {
  const defaultUser = {
    role_id: {
      role_description: "guest",
    },
  };
  //const userData = {};  // will fetch user dashboard data from database
  //const userData = { name: "User", role: "customer" };
  try {
    const mediaItem = await Media.findById(req.params.id); // Fetch the media item by ID

    if (!mediaItem) {
      return res.status(404).send("Media not found");
    }

    // Render the view with media item data
    res.render("landingpage/view_media", {
      mediaItem,
      user: defaultUser,
      activePage: "view_media",
    });
  } catch (error) {
    console.error("Error fetching media item:", error);
    res.status(500).send("Error retrieving media item");
  }
  //console.log('User dashboard data sent');
};

exports.searchGuestMedia = async (req, res) => {
    const defaultUser = {
      role_id: {
        role_description: "guest",
      },
    };
  try {
    const query = req.query.query; // Get the search query from the request
    const mediaResults = await Media.find({
      $or: [{ media_title: { $regex: query, $options: "i" } }],
    }).populate({
      path: "genre_id",
      select: "genre_description",
    });

    res.render("landingpage/search_results.ejs", {
      mediaResults,
      query,
      activePage: "inventory",
      user: defaultUser,
    }); // Pass the results and query to the view
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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

exports.viewBorrowed = async (req, res) => {
  const user = req.user;
  const { page = 1, limit = 10 } = req.query;

  try {
    const borrowedItems = await Borrowed.find({ user_id: user._id });

    //validates ids
    const validMediaIds = await Media.find({
      _id: { $in: borrowedItems.map((item) => item.media_id) },
    }).select("_id");

    const validIdsSet = new Set(
      validMediaIds.map((media) => media._id.toString())
    );

    //removes mdedia that have been deleted from the database
    const validBorrowedItems = borrowedItems.filter((item) =>
      validIdsSet.has(item.media_id.toString())
    );

    //removed invalids
    const invalidBorrowedItems = borrowedItems.filter(
      (item) => !validIdsSet.has(item.media_id.toString())
    );

    if (invalidBorrowedItems.length > 0) {
      const invalidIds = invalidBorrowedItems.map((item) => item._id);
      await Borrowed.deleteMany({ _id: { $in: invalidIds } });
      console.log("Removed invalid borrowed items:", invalidIds);
    }

    const paginatedBorrowedItems = validBorrowedItems.slice(
      (page - 1) * limit,
      page * limit
    );

    const populatedBorrowedItems = await Borrowed.find({
      _id: { $in: paginatedBorrowedItems.map((item) => item._id) },
    })
      .populate({
        path: "media_id",
        select: "media_title author genre_id",
        populate: {
          path: "genre_id",
          select: "genre_description",
        },
      })
      .exec();

    const totalBorrowed = validBorrowedItems.length;
    const totalPages = Math.ceil(totalBorrowed / limit);

    // Render the borrowed_media view
    res.render("user/borrowed_media.ejs", {
      items: populatedBorrowedItems,
      user,
      activePage: "borrowed_media",
      currentPage: parseInt(page), // Current page number
      totalPages, // Total number of pages
      limit: parseInt(limit), 
    });
  } catch (error) {
    console.error("Error fetching borrowed items:", error);
    res.status(500).send("An error occurred while fetching borrowed media");
  }
};



exports.viewWishlist = async (req, res) => {
  const user = req.user; 
  const { page = 1, limit = 10 } = req.query;

  try {
   
    const validMediaIds = await Media.find({
      _id: { $in: user.wishlist },
    }).select("_id"); 

    const validIdsSet = new Set(
      validMediaIds.map((media) => media._id.toString())
    );

    const validWishlist = user.wishlist.filter((id) =>
      validIdsSet.has(id.toString())
    );

    // Update user wishlist if invalid IDs were found - in the case of deleting media
    if (validWishlist.length !== user.wishlist.length) {
      user.wishlist = validWishlist;
      await user.save();
      console.log("Invalid media IDs removed from the wishlist");
    }

    const totalWishlist = validWishlist.length;

    //paginate wishlist IDs
    const paginatedIds = validWishlist.slice((page - 1) * limit, page * limit);

    const wishlistItems = await Media.find({
      _id: { $in: paginatedIds },
    }).populate({
      path: "genre_id",
      select: "genre_description",
    });

    const totalPages = Math.ceil(totalWishlist / limit);

    res.render("user/wishlist.ejs", {
      items: wishlistItems,
      user,
      activePage: "wishlist",
      currentPage: parseInt(page),
      totalPages,
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res.status(500).send("An error occurred while fetching the wishlist");
  }
};





  exports.searchMedia = async (req, res) => {
    try {
      const query = req.query.query;
      const user = req.user;
      const mediaResults = await Media.find({
        $or: [{ media_title: { $regex: query, $options: "i" } }],
      })
        .populate({
          path: "genre_id",
          select: "genre_description",
        });

      res.render("user/search_results.ejs", { mediaResults, query, activePage: 'inventory', user}); // Pass the results and query to the view
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };

