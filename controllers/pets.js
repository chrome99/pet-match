const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const { User } = require("../models/users");
const { Pet } = require("../models/pets");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dfdcu51jz",
    api_key: "917322833162277",
    api_secret: "cQttpRHOkf-IrdbEHGANNMB4ZUo"
});

//search pets
exports.search = asyncHandler(async (req, res) => {
    const searchQuery = {};
    const { adoptionStatus, type, height, weight, name, page = 1, limit = 30 } = req.query;
    if (adoptionStatus) {searchQuery.adoptionStatus = adoptionStatus}
    if (type) {searchQuery.type = type}
    if (height) {searchQuery.height = height}
    if (weight) {searchQuery.weight = weight}
    if (name) {searchQuery.name = { "$regex": name, "$options": "i" }}

    const queryCount = await Pet.countDocuments(searchQuery);
    const searchResult = await Pet.find(searchQuery)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
    res.status(200).send({count: queryCount, result: searchResult});
});

//get recent pets
exports.getRecent = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const recentPets = await Pet.find().sort({ createdAt: -1 }).limit(limit)
    res.status(200).send(recentPets);
});

//gets multiple pets by array of ids
exports.getMultiple = asyncHandler(async (req, res) => {
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

    //get array of ObjectId
    const objectIdsList = idsList.map((id) => {
        return new ObjectId(id);
    })

    //search by ids and return result
    const searchResult = await Pet.find({'_id': { $in: objectIdsList}});
    res.status(200).send(searchResult);
});

//get by id
exports.getById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const searchResult = await Pet.findById(id);
    res.status(200).send(searchResult);
});

//post new pet
exports.post = asyncHandler(async (req, res) => {
    const {type, name, adoptionStatus, height, weight,
        color, hypoallergnic, dietery, breed} = req.body;

   if (!(type && name && adoptionStatus && height && weight
       && color && hypoallergnic && dietery && breed)) {
       return res.status(400).send("All input is required");
   }

   const newPet = new Pet(req.body);

   // Upload file / image
   const b64 = Buffer.from(req.file.buffer).toString("base64");
   const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
   const data = await cloudinary.uploader.upload(dataURI, {
       public_id: newPet._id,
       folder: 'pets'
   })
    newPet.picture = data.secure_url;
    const savedPet = await newPet.save()
    res.status(200).send(savedPet);
});

//change adoption status to available, adopted, or fostered
exports.changeAdoptionStatus = asyncHandler(async (req, res) => {
    let { type, value } = req.body;
    const petId = req.params.id;
    const userId = req.user.user_id;
    if (type === "adopt") {type = "Adopted"}
    if (type === "foster") {type = "Fostered"}
    
    if (!(type === "Adopted" || type === "Fostered")) {
        return res.status(400).send("Invalid Type! (adopt / foster)");
    }
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
    const updatedPet = await pet.save();

    return res.status(200).send(updatedUser);
});

//update pet
exports.update = asyncHandler(async (req, res) => {
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

    //bio can be an empty field, so if got "empty_bio" from frontend, set to empty string
    if (bio === "empty_bio") {petToUpdate.bio = ""}

    const result = await petToUpdate.save();
    return res.status(200).send(result);
});