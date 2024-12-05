const mongoose = require('mongoose');
const {Media} = require('./inventory.js');
const {Customer} = require('./customer.js');

const BorrowedSchema = new mongoose.Schema({
    media_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_rented: { type: Date, required: true },
    date_returned: { type: Date },
    quant: { type: Number, default: 1 },
});


BorrowedSchema.statics.borrowMedia = async function (media_id, user_id) {
    const session = await mongoose.startSession(); //this wokrs apparenty
    session.startTransaction();

    try {
        // making the entry for borrowed media
        const borrowedMedia = new this({
            media_id,
            user_id,
            date_rented: new Date(),
            date_returned: null,
           // quant: 1,
        });

        // hetting the obj id
        const savedBorrowed = await borrowedMedia.save({ session });
        // console.log("Customer Model:", Customer);
        // console.log("Customer.findByIdAndUpdate:", typeof Customer.findByIdAndUpdate);
        // Add the borrowed media's ObjectId to the customer's borrowed array
        await Customer.findByIdAndUpdate(user_id, {
            $push: { borrowed: savedBorrowed._id }, 
        });
        
        // Decrease the quantity of the media (just by one for now)
        const updatedMedia = await Media.findByIdAndUpdate(media_id, { $inc: { quant: -1 } });
        
        // check if therre is media
        if (!updatedMedia || updatedMedia.quant < 0) {
            throw new Error('Insufficient media quantity');
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return savedBorrowed;
    } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction();
        session.endSession();

        console.error("Error in borrowMedia model method:", error);
        throw error; // Propagate error to the controller
    }
};


module.exports = mongoose.model('borroweds', BorrowedSchema);
