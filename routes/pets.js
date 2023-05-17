const express = require("express");
const router = express.Router();

const PetController = require("../controllers/pets");
const { verifyToken, adminOnly } = require("../middleware/auth");

//todo: remove later for a different general controller / utility
const multer = require("multer");
const storage = new multer.memoryStorage();
const upload = multer({storage: storage});

//search pets
router.get("/", PetController.search);

//get recent pets
router.get("/recent", PetController.getRecent);

//gets multiple pets by array of ids
router.get("/multiple", PetController.getMultiple)

//get by id
router.get("/:id", PetController.getById)

//post new pet
router.post("/", verifyToken, adminOnly, upload.single("pet_img"), PetController.post)

//change adoption status to available, adopted, or fostered
router.post("/:id/adopt", verifyToken, PetController.changeAdoptionStatus)

//update pet
router.put("/:id", verifyToken, adminOnly, upload.single("pet_img"), PetController.update)

module.exports = router;