const { Media, Genre } = require("../../db/models/inventory.js");
const {Customer, Staff} = require('../../db/models/customer.js');
const Borrowed = require('../../db/models/borrowed.js');
const axios = require("axios"); 
require('dotenv').config();


// Hardcoded user data for now; should ideally come from session or authentication middleware
// const userData = {
//   role: "librarian",
// };

exports.getLibrarianDashboard = (req, res) => {
  try {
    const user = req.user;
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

//show form to add book
exports.showAddForm = async (req, res) => {
  const activePage = "add_book";
  try {
    const user = req.user;
    const genres = await Genre.find(); //fetch genres
    res.render("branch_librarian/add_book", {
      user,
      activePage,
      genres,
    }); //pass genres and active book
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("An error occurred while fetching genres");
  }
};

//update book form
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

exports.addBook = async (req, res) => {
  const user = req.user;
  try {
    const { media_title, author, genre_id, quant } = req.body;

    if (!media_title || !author || !genre_id || !quant) {
      return res.status(400).send("All fields are required.");
    }

    if (isNaN(quant) || quant < 0) {
      return res.redirect(
        `/branch_librarian/inventory/new?_id=${user._id}&status=error&message=Quantity has to be 0 or greater`
      );
    }
    console.log("Request Body:", req.body);

    //using custom search engine and google API search for the book cover of the book added
    const searchQuery = `${media_title} book cover`;
    const apiKey = process.env.API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchQuery
    )}&searchType=image&key=${apiKey}&cx=${searchEngineId}`;

    let imageUrl = "";
    try {
      const imageResponse = await axios.get(searchUrl);
      imageUrl = imageResponse.data.items?.[0]?.link || ""; //takes the first image result
      if (!imageUrl) {
        console.warn("No image found for the book title.");
      }
    } catch (apiError) {
      console.error("Error fetching image from API:", apiError.message);
    }

    const newMedia = new Media({
      media_title: media_title,
      author: author,
      genre_id: genre_id,
      quant: quant,
      branch: user.branch,
      image: imageUrl, //saves image adress to display
    });

    await newMedia.save();

    res.redirect(`/branch_librarian/librarianInventory?_id=${user._id}`);
  } catch (error) {
    console.error("Error creating media:", error);
    res.status(500).send("An error occurred while adding the media.");
  }
};


exports.deleteMedia = async (req, res) => {
  const mediaId = req.params.id;
  const user = req.user;
  try {
    const deletedMedia = await Media.findByIdAndDelete(mediaId);

    if (!deletedMedia) {
      return res.status(404).send("Media not found.");
    }

    console.log(`Media with ID ${mediaId} has been deleted.`);

    res.redirect(`/branch_librarian/librarianInventory?_id=${user._id}`); // Redirect to the inventory page
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).send("An error occurred while deleting the media.");
  }
};


// Handle updating a book
exports.updateMediaQuantity = async (req, res) => {
  const mediaId = req.params.id; // Media ID passed in the URL
  const { newQuantity } = req.body; 
  const user = req.user;

  try {
    //validate new quant
    if (isNaN(newQuantity) || newQuantity < 0) {
      return res.status(400).send("Invalid quantity value.");
    }

    //update the media quantity
    const updatedMedia = await Media.findByIdAndUpdate(
      mediaId,
      { quant: newQuantity },
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).send("Media not found.");
    }

    console.log(`Media quantity updated: ${updatedMedia}`);
    res.redirect(`/branch_librarian/librarianInventory?_id=${user._id}`); 
  } catch (error) {
    console.error("Error updating media quantity:", error);
    res
      .status(500)
      .send("An error occurred while updating the media quantity.");
  }
};

