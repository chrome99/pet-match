const express = require('express');
const router = express.Router();

const WishlistController = require("../controllers/wishlists");

//get all pets that were wishlisted by a certain user, or get all users that wishlisted a certain pet
router.get("/", WishlistController.getPetsOrUsers)

//post new wishlist
router.post("/", WishlistController.post)

//delete a specific wishlist with userId and petId
router.delete("/", WishlistController.deleteOne)

module.exports = router;