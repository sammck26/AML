const connectDB = require("./db.js"); // Import the connection promise
const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  quant: { type: Number, required: true },
});

const GenreSchema = new mongoose.Schema({
  genre_description: { type: String, required: true },
});

const Media = mongoose.model("Media", MediaSchema);
const Genre = mongoose.model("Genre", GenreSchema);

(async () => {
  try {
    const db = await connectDB; // Wait for the connection to be ready
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
    console.log("Media Items:", mediaItems);
  } catch (error) {
    console.error("Error while fetching media inventory:", error);
  }
})();







/*async function seedData() {
    await Genre.create({
      genre_description: "Gore",
    })

    await Media.create({
      media_title: "Dune2",
      author: "Frank Herbert",
      genre_id: "673358a98c529a6a6ec66a65",
      quant: 5,
    });
  }

  seedData().then(() => console.log("Sample data added"));*/

module.exports = { Media, Genre }; // Export both models
