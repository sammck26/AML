const mongoose = require('mongoose');

const BorrowedSchema = new mongoose.Schema({
    media_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_rented: { type: Date, required: true },
    date_returned: { type: Date },
    quant: { type: Number, default: 1 },
});


BorrowedSchema.statics.borrowMedia = async function (media_id, user_id) {
    try {
        const borrowedMedia = new this({
            media_id,
            user_id,
            date_rented: new Date(),
            date_returned: null, 
            quant: 1, 
        });
        return await borrowedMedia.save();
    } catch (error) {
        console.error("Error in borrowMedia model method:", error);
        throw error; // Propagate error to the controller
    }
};

module.exports = mongoose.model('Borrowed', BorrowedSchema);
