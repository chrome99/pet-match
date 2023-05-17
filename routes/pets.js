const express = require('express');
const router = express.Router();

const { ObjectId } = require("mongodb");
const { User } = require("../models/users");
const { Pet } = require("../models/pets");
const { verifyToken, adminOnly } = require("../middleware/auth");

//todo: remove later for a different controller function
const multer = require("multer");
const storage = new multer.memoryStorage();
const upload = multer({storage: storage});
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dfdcu51jz",
    api_key: "917322833162277",
    api_secret: "cQttpRHOkf-IrdbEHGANNMB4ZUo"
});

router.get("/", (req, res) => {
    const searchQuery = {};
    const { adoptionStatus, type, height, weight, name } = req.query;
    if (adoptionStatus) {searchQuery.adoptionStatus = adoptionStatus}
    if (type) {searchQuery.type = type}
    if (height) {searchQuery.height = height}
    if (weight) {searchQuery.weight = weight}
    if (name) {searchQuery.name = { "$regex": name, "$options": "i" }}

    Pet.find(searchQuery)
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})
router.get("/recent", (req, res) => {
    const { limit } = req.query;
    Pet.find().sort({ createdAt: -1 }).limit(limit)
    .then((recentPets) => {
        return res.status(200).send(recentPets);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
})

//gets multiple pets by array of ids
router.get("/multiple", (req, res) => {
    const { ids } = req.query;

    //check for empty input
    if (!ids) {
        return res.status(400).send("ids Required");
    }

    //check for invalid ids
    idsList = ids.split(",");
    for(let i = 0; i < idsList.length; i++) {
        if (!ObjectId.isValid(idsList[i])) {
            return res.status(400).send("Invalid Id");
        }
    }

    const objectIdsList = idsList.map((id) => {
        return new ObjectId(id);
    })

    Pet.find({'_id': { $in: objectIdsList}})
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    Pet.findById(id)
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

router.post("/", verifyToken, adminOnly, upload.single("pet_img"), (req, res) => {
    const {type, name, adoptionStatus, height, weight,
         color, bio, hypoallergnic, dietery, breed} = req.body;

    if (!(type && name && adoptionStatus && height && weight
        && color && bio && hypoallergnic && dietery && breed)) {
        return res.status(400).send("All input is required");
    }

    const newPet = new Pet(req.body);

    // Upload file / image
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    cloudinary.uploader.upload(dataURI, {
        public_id: newPet._id,
        folder: 'pets'
    })
    .then((data) => {
        newPet.picture = data.secure_url;
        newPet.save()
        .then(() => {
            res.status(200).send(newPet);
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send(err.message);
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err.message);
    });
})

router.post("/:id/adopt", verifyToken, async (req, res) => {
    let { type, value } = req.body;
    const petId = req.params.id;
    const userId = req.user.user_id;
    if (type === "adopt") {type = "Adopted"}
    if (type === "foster") {type = "Fostered"}
    
    if (type === "Adopted" || type === "Fostered") {
        const currentUser = await User.findById(userId);
        const pet = await Pet.findById(petId);

        if (value === true) {
            const UserOwnsPet = currentUser.pets.includes(petId);
            //if user wants to adopt / foster a new pet, but that pet is already taken
            if (!UserOwnsPet && pet.adoptionStatus !== "Available") {
                return res.status(400).send("Pet Already " + pet.adoptionStatus + " By Someone Else");
            }
            //if user wants to adopt / foster a pet that he owns, but that pet is fostered
            //(if user owns (fostered / adopted) pet, he can only adopt it if the pet is fostered)
            if (UserOwnsPet && pet.adoptionStatus !== "Fostered") {
                return res.status(400).send("Pet Already " + pet.adoptionStatus + " By User");
            }

            //if user wants to adopt a pet that he fostered, don't add the pet twice to user's pets array
            //only add the pet to array in regular cases
            if (!UserOwnsPet) {
                currentUser.pets.push(petId);
            }
    
            pet.adoptionStatus = type;
        }
        else {
            if (!currentUser.pets.includes(petId)) {
                return res.status(400).send("User Does Not Have This Pet");
            }
            if(pet.adoptionStatus !== type) {
                return res.status(400).send("Pet Is Not Adopted");
            }
            const petIndex = currentUser.pets.indexOf(petId);
            currentUser.pets.splice(petIndex, 1);
            pet.adoptionStatus = "Available";
        }

        const updatedUser = await currentUser.save();
        await pet.save();

        return res.status(200).send(updatedUser);
    }
    else {
        return res.status(400).send("Invalid Type! (adopt / foster)");
    }
})

router.put("/:id", verifyToken, adminOnly, upload.single("pet_img"), async (req, res) => {
    const id = req.params.id;
    const {type, name, adoptionStatus, height, weight,
         color, bio, hypoallergnic, dietery, breed} = req.body;

    const petToUpdate = await Pet.findById(id);

    if (req.file) {
        // Upload file / image
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const data = await cloudinary.uploader.upload(dataURI, {
            public_id: petToUpdate._id,
            folder: 'pets'
        })
        petToUpdate.picture = data.secure_url;
    }

    if (type) {petToUpdate.type = type}
    if (name) {petToUpdate.name = name}
    if (adoptionStatus) {petToUpdate.adoptionStatus = adoptionStatus}
    if (height) {petToUpdate.height = height}
    if (weight) {petToUpdate.weight = weight}
    if (color) {petToUpdate.color = color}
    if (bio) {petToUpdate.bio = bio}
    if (hypoallergnic) {petToUpdate.hypoallergnic = hypoallergnic}
    if (dietery) {petToUpdate.dietery = dietery}
    if (breed) {petToUpdate.breed = breed}

    const result = await petToUpdate.save();
    return res.status(200).send(result);
})

module.exports = router;