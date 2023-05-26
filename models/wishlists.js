const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true}
}, {timestamps: true});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = {Wishlist};