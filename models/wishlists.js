const mongoose = require("mongoose");

const rString = {type: String, required: true}
const wishlistSchema = new mongoose.Schema({
    userId: rString,
    petId: rString
}, {timestamps: true});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = {Wishlist};