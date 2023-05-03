const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./userSchema");
const { Pet } = require("./petSchema");
const { Wishlist } = require("./wishlistSchema");
const auth = require("./middleware/auth");
const URI = process.env.URI;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

mongoose.connect(URI)
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err));

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.post("/auth", auth, (req, res) => {
  res.status(200).send("Welcome!");
});

app.post("/pet/:id/adopt", auth, async (req, res) => {
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

app.get("/pet/:id", (req, res) => {
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

//gets multiple pets by array of ids
app.get("/petsbyid", (req, res) => {
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
        return new mongoose.Types.ObjectId(id);
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

app.get("/pets", (req, res) => {
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

app.post("/wishlist", async (req, res) => {
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
app.delete("/wishlist", async (req, res) => {
    const {userId, petId} = req.query;
    if (!(userId && petId)) {
        return res.status(400).send("Invalid Query, Both userId And petId Are Required");
    }

    const result = await Wishlist.deleteOne({userId: userId, petId: petId})
    return res.status(200).send(result);
})

//get all pets that were wishlisted by a certain user, or get all users that wishlisted a certain pet
app.get("/wishlist", async (req, res) => {
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

app.put("/user/:id", auth, (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, password, bio } = req.body;
    User.findById(id)
    .then(userDoc => {
        if (userDoc) {
            User.findOne({ email })
            .then(userExists => {
                if (userExists) {
                    return res.status(400).send("Email already in use");
                }
                else {
                    if (firstName) {userDoc.firstName = firstName}
                    if (lastName) {userDoc.lastName = lastName}
                    if (email) {userDoc.email = email}
                    if (phone) {userDoc.phone = phone}
                    if (password) {userDoc.password = password}

                    //bio can be an empty field, so if empty string set to empty string
                    if (bio || bio === "") {userDoc.bio = bio}

                    userDoc.save()
                    .then(updatedUser => {
                        return res.status(200).send(updatedUser);
                    })
                }
            })
        }
        else {
            return res.status(400).send("User does not exist");
        }
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
  });
  

app.post('/register', (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!(firstName && lastName && email && phone && password)) {
        return res.status(400).send("All input is required");
    }

    User.findOne({ email })
    .then(userExists => {
        if (userExists) {
            return res.status(400).send("User already exists");
        }

        req.body.admin = false;
        req.body.bio = "";
        req.body.pets = [];
        const newUser = new User(req.body);
        newUser.save()
        .then(result => {
            const token = jwt.sign({ user_id: newUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h" },);
            newUser.token = token;
            res.status(200).send(newUser);
        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
});
  
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
    
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            res.status(400).send("Invalid Email");
            return;
        }

        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h",});
                user.token = token;
                res.status(200).json(user);
            }
            else {
                res.status(400).send("Invalid Password");
                return;
            }                
        });
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})