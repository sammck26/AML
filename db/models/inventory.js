const mongoose = require("mongoose");
const path = require('path');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

mongoose.connect(process.env.MONGO_URI, { //uses mongoose to connect 
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");
  }).catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

const MediaSchema = new mongoose.Schema({
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  quant: { type: Number, required: true },
});

const GenreSchema = new mongoose.Schema({
  genre_description: { type: String, required: true }, 
  genre_id: { type: Number, required: true, unique: true }, 
});

const Media = mongoose.model("Media", MediaSchema);
const Genre = mongoose.model("Genre", GenreSchema);

MediaSchema.methods.isAvailable = function () { // if the amount is more than zero media is available
  return this.quant > 0 ? "available" : "not available";
};


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
    console.log(mediaItems);
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = { Media, Genre }; // Export both models
