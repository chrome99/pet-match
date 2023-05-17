const express = require('express');
const router = express.Router();

const { ObjectId } = require("mongodb");
const { Wishlist } = require("../models/wishlists");
const { Pet } = require("../models/pets");
const { User } = require("../models/users");
const { verifyToken, adminOnly } = require("../middleware/auth");

//get all pets that were wishlisted by a certain user, or get all users that wishlisted a certain pet
router.get("/", async (req, res) => {
    const {userId, petId} = req.query;
    if ((!userId && !petId) || (userId && petId)) {
        return res.status(400).send("Invalid Query, userId OR petId Required");
    }

    if (userId) {
        const allUserWishes = await Wishlist.find({userId: userId});
        const allPetsWishlisted = allUserWishes.map(wishlist => wishlist.petId)
        return res.status(200).send(allPetsWishlisted);
    }
    if (petId) {
        //get all the fans of the pet that wishlisted it!
        const allPetWishes = await Wishlist.find({petId: petId});
        const allFans = allPetWishes.map(wishlist => wishlist.userId)
        return res.status(200).send(allFans);
    }
})

router.post("/", async (req, res) => {
    const {userId, petId} = req.body;
    if (!userId || !petId) {
        return res.status(400).send("Invalid Body, userId and petId Required");
    }

    //check if user id and pet id exist in db
    const pet = await Pet.findById(petId);
    const user = await User.findById(userId);
    if (!user || !pet) {
        return res.status(400).send("Invalid Id");
    }
    
    //check if wishlist exists
    const wishlistExists = await Wishlist.exists({userId: userId, petId: petId});
    if (wishlistExists) {
        return res.status(400).send("Already Wishlisted");
    }


    //create new wishlist
    const newWishlist = new Wishlist({userId: userId, petId: petId});
    const result = await newWishlist.save();
    return res.status(200).send(result);
})

//delete a specific wishlist with userId and petId
router.delete("/", async (req, res) => {
    const {userId, petId} = req.query;
    if (!(userId && petId)) {
        return res.status(400).send("Invalid Query, Both userId And petId Are Required");
    }

    const result = await Wishlist.deleteOne({userId: userId, petId: petId})
    return res.status(200).send(result);
})

module.exports = router;