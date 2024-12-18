const connectDB = require("./db.js"); // Import the connection function
const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  quant: { type: Number, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  image: { type: String, required: false },
});

const GenreSchema = new mongoose.Schema({
  genre_description: { type: String, required: true },
});

const BranchSchema = new mongoose.Schema({
  branch_description: { type: String, required: true },
  city: { type: String, required: true },
  hours: { type: String, required: true },
});

const Media = mongoose.model("Media", MediaSchema);
const Genre = mongoose.model("Genre", GenreSchema);
const Branch = mongoose.model("Branch", BranchSchema);

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

/*async function seedData() {
  const branches = [
    { branch_description: "South Side", city: "London", hours: "8-4" },
    { branch_description: "North Point", city: "Manchester", hours: "9-5" },
    { branch_description: "Central Plaza", city: "Birmingham", hours: "10-6" },
    { branch_description: "East End", city: "Liverpool", hours: "7-3" },
    { branch_description: "West Wing", city: "Leeds", hours: "9-5" },
    { branch_description: "Harbor Front", city: "Bristol", hours: "8-4" },
    { branch_description: "Park Lane", city: "Sheffield", hours: "8-4" },
  ];

  try {
    await Branch.insertMany(branches);
    console.log("Sample branches added!");
  } catch (error) {
    console.error("Error adding sample branches:", error);
  }
}


seedData();*/

module.exports = { Media, Genre }; // Export both models
