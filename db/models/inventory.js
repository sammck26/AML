const { Console } = require('console');
const mongoose = require('mongoose');


const MedaiSchema = new mongoose.Schema({ // create a schema for media
  media_title: { type: String, required: true },
  author: { type: String, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }, //uses the genre referance in media table to lookup genre type using mongoose
  quant: { type: Number, required: true },
});


const genreSchema = new mongoose.Schema({ // create a schema for genre
    genre_description: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre_Description'}, // so i can acess it in the media table
    genre_id: {type: Number, required: true},
  });
  
const Media = mongoose.model('Media', MedaiSchema); // creat models for media and genre
const Genre = mongoose.model('Genre', genreSchema);

//console.log("Media Model:", Media);
//console.log("Media Schema:", MedaiSchema);

MedaiSchema.methods.isAvailable = function () { // decide if media is available
    if (this.quant > 0) {
        return this.status === 'available';
    } else {
      return this.status === 'not availabel';
    }
};

Media.find()
  .populate(('Genre'), Genre('Genre_Description')) // populate genre_id field with genre_description
  .populate(quant, isAvailable) // populate quant field with isAvailable method
  .then((mediaItems) => {
    console.log(mediaItems); // each media item will include genre_description adn isAvailable method
  })
  .catch((error) => {
    console.error(error);
  });
  module.exports = Media; // export the model