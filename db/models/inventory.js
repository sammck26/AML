const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  quant: { type: Number, required: true },
});

const GenreSchema = new mongoose.Schema({
  genre_description: { type: String, required: true }, // Changed type to String for description
  genre_id: { type: Number, required: true, unique: true }, // genre_id as unique to avoid duplicates
});

const Media = mongoose.model("Media", MediaSchema);
const Genre = mongoose.model("Genre", GenreSchema);

MediaSchema.methods.isAvailable = function () {
  return this.quant > 0 ? "available" : "not available";
};

// Updated query with correct population syntax
Media.find()
  .populate({
    path: "genre_id",
    select: "genre_description", // populate genre_description from Genre
  })
  .then((mediaItems) => {
    mediaItems.forEach((item) => {
      console.log({
        ...item.toObject(),
        availability: item.isAvailable(), // include isAvailable status for each media item
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = { Media, Genre }; // Export both models
