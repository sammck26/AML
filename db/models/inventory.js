const connectDB = require("./db.js"); // Import the connection function
const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  quant: { type: Number, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

const GenreSchema = new mongoose.Schema({
  genre_description: { type: String, required: true },
});

const Media = mongoose.model("Media", MediaSchema);
const Genre = mongoose.model("Genre", GenreSchema);

(async () => {
  try {
    const db = await connectDB; 
    const collections = await db.connection.db.listCollections().toArray();
    const mediaCollection = collections.find((c) => c.name === "media");

    if (mediaCollection) {
      console.log("Media collection found:", mediaCollection.name);
    } else {
      console.log("Media collection not found.");
    }

    // Fetch all media items
    const mediaItems = await Media.find().populate({
      path: "genre_id",
      select: "genre_description",
    });
    // console.log("Media Items:", mediaItems);
  } catch (error) {
    console.error("Error while fetching media inventory:", error);
  }
})();

/* async function seedData() {
  const genres = [
    { genre_description: "Fantasy" },
    { genre_description: "Romance" },
    { genre_description: "Mystery" },
    { genre_description: "Thriller" },
    { genre_description: "Non-Fiction" },
    { genre_description: "Historical Fiction" },
    { genre_description: "Young Adult" },
  ];

  try {
    await Genre.insertMany(genres);
    console.log("Sample genres added!");
  } catch (error) {
    console.error("Error adding sample genres:", error);
  }
}

seedData();*/

module.exports = { Media, Genre }; // Export both models
