const { Media, Genre } = require("../../db/models/inventory.js");
const {Customer, Staff} = require('../../db/models/customer.js');
const Borrowed = require('../../db/models/borrowed.js');


// Hardcoded user data for now; should ideally come from session or authentication middleware
const userData = {
  role: "librarian",
};

exports.getLibrarianDashboard = (req, res) => {
  try {
    const user = req.user; // User is already fetched by middleware
    res.render("branch_librarian/librarian_dashboard", {
      user,
      activePage: "dashboard",
    });
    console.log("User dashboard data sent:", user);
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("An error occurred while rendering the dashboard");
  }
};

// Show form to add a new book
exports.showAddForm = async (req, res) => {
  const activePage = "add_book";
  try {
    const genres = await Genre.find(); // Fetch all genres from the database
    res.render("branch_librarian/add_book", {
      user: userData,
      activePage,
      genres,
    }); // Pass genres and activePage to the view
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("An error occurred while fetching genres");
  }
};

// Show form to update a book
exports.showUpdateForm = async (req, res) => {
  const user = req.user || { name: "Jimmy", role: "librarian" };
  const activePage = "update_book";
  try {
    const mediaItem = await Media.findById(req.params.id).populate("genre_id");
    res.render("inventory/update_book", { item: mediaItem, user, activePage });
  } catch (error) {
    console.error("Error fetching media item:", error);
    res.status(500).send("Error fetching item for update");
  }
};

// Handle adding a new book
exports.addBook = async (req, res) => {
  try {
    const { media_title, author, genre_id, quant } = req.body;
    await Media.create({ media_title, author, genre_id, quant });
    res.redirect("/inventory");
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Error adding book");
  }
};

// Handle updating a book
exports.updateBook = async (req, res) => {
  try {
    const { media_title, author, genre_id, quant } = req.body;
    await Media.findByIdAndUpdate(req.params.id, {
      media_title,
      author,
      genre_id,
      quant,
    });
    res.redirect("/inventory");
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Error updating book");
  }
};
