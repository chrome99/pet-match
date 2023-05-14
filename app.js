const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./userSchema");
const { Pet } = require("./petSchema");
const { Message } = require("./messageSchema");
const { Wishlist } = require("./wishlistSchema");
const { Request } = require("./requestSchema");
const { verifyToken, adminOnly } = require("./middleware/auth");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dfdcu51jz",
    api_key: "917322833162277",
    api_secret: "cQttpRHOkf-IrdbEHGANNMB4ZUo"
});
const multer = require("multer");
const storage = new multer.memoryStorage();
const upload = multer({storage: storage});
const URI = process.env.URI;
const PORT = process.env.PORT;
const WEBSOCKETPORT = process.env.WEBSOCKETPORT;

const app = express();

app.use(express.json());


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})

mongoose.connect(URI)
    .then((result) => {console.log("connected to db"); connectToSocketIo();})
    .catch((err) => console.log(err));

function connectToSocketIo() {
    const io = require('socket.io')(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });
    io.on("connection", (socket) => {
        
      // if message sent, send the message to everyone on a room chat
      socket.on("sendMessage", (data) => {
        //add to db
        const newMessage = new Message(data);
        newMessage.save()
        .then((result) => {
            io.to(result.requestId).emit("sendMessage", result); //requestId is the room!
        })
        .catch(err => {
            console.log(err);
        })
      })

      socket.on("changeReqState", async (data) => {
        const { id, value, adminId } = data;

        //checking for adminId only if value is "open", because adminId is only required for opening / adopting a request
        if (!(id && value)) {
            throw Error("Invalid Body, Both id & value Are Required");
        }
        if (value === "open" && !adminId) {
            throw Error("Invalid Body, adminId Is Required For value: open");
        }
        
    
        const request = await Request.findById(id);
        if (!request) {
            throw Error("Request Not Found");
        }
    
        if (value === "open") {
            request.adminId = adminId;
            request.state = value;
        }
        else if (value === "closed") {
            request.state = value;
        }
        else if (value === "unattended"){
            request.adminId = "";
            request.state = value;
        }
        else {
            throw Error("Invalid value (open | closed | unattended)");
        }
    
        const result = await request.save();
        io.to(id).emit("changeReqState", value);
      })

      // Join the user to a socket room
      socket.on('joinRoom', (data) => {
        socket.join(data); 
      });
    });
}

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.post("/auth", verifyToken, (req, res) => {
  res.status(200).send("Welcome!");
});

app.get("/admin", adminOnly, (req, res) => {
    res.status(200).send("Welcome Admin!");
})

//update request state (open, close, unattended)
//unattended means that the admins has abandoned the request
app.put("/request", verifyToken, adminOnly, async (req, res) => {
    const { id, value, adminId } = req.body;

    //checking for adminId only if value is "open", because adminId is only required for opening / adopting a request
    if (!(id && value)) {
        return res.status(400).send("Invalid Body, Both id & value Are Required");
    }
    if (value === "open" && !adminId) {
        return res.status(400).send("Invalid Body, adminId Is Required For value: open");
    }
    

    const request = await Request.findById(id);
    if (!request) {
        return res.status(400).send("Request Not Found");
    }

    if (value === "open") {
        request.adminId = adminId;
        request.state = value;
    }
    else if (value === "closed") {
        request.state = value;
    }
    else if (value === "unattended"){
        request.adminId = "";
        request.state = value;
    }
    else {
        return res.status(400).send("Invalid value (open | closed | unattended)");
    }

    const result = await request.save();
    res.status(200).send(result);
})

//get all requests handled by admin
app.get("/requestadmin/:id", verifyToken, adminOnly, async (req, res) => {
    const id = req.params.id;

    const unattendedRequest = await Request.find({adminId: id});
    res.status(200).send(unattendedRequest);
})

//get all requests made by user (get by user id)
app.get("/request/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const allUserRequests = await Request.find({userId: id});
    res.status(200).send(allUserRequests);
})

//get all unattended requests
app.get("/unattendedrequest", verifyToken, adminOnly, async (req, res) => {
    const allUnattendedRequests = await Request.find({state: "unattended"});
    res.status(200).send(allUnattendedRequests);
})

//post new request
app.post("/request", verifyToken, async (req, res) => {
    const { title, body, userId, userName } = req.body;
    if (!(title && body && userId && userName)) {
        return res.status(400).send("All input is required");
    }

    const newRequest = new Request({title: title, userId: userId, state: "unattended"})
    const newFirstMsg = new Message({requestId: newRequest._id, userId: userId, userName: userName, value: body}) 
    requestResult = await newRequest.save()
    msgResult = await newFirstMsg.save()
    res.status(200).send(requestResult);
})

//get messages by request id
app.get("/messages/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    result = await Message.find({requestId: id})
    res.status(200).send(result);
})

app.post("/pet/:id/adopt", verifyToken, async (req, res) => {
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

app.post("/pet", verifyToken, adminOnly, upload.single("pet_img"), (req, res) => {
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

app.put("/pet/:id", verifyToken, adminOnly, upload.single("pet_img"), async (req, res) => {
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

app.get("/recentpets", (req, res) => {
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

app.get("/users", verifyToken, adminOnly, (req, res) => {
    User.find()
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

app.get("/user/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    User.findById(id)
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

//add / remove user from admins
app.post("/adminuser", verifyToken, adminOnly, (req, res) => {
    const { id, adminValue } = req.body;

    if (adminValue === undefined) {
        return res.status(400).send("adminValue Required");
    }
    if (typeof adminValue !== "boolean") {
        return res.status(400).send("adminValue Should Be Boolean");
    }
    if (id === undefined) {
        return res.status(400).send("id Required");
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Id");
    }
    

    User.findById(id)
    .then(user => {
        user.admin = adminValue;
        user.save().then(updatedUser => {
            res.status(200).send(updatedUser);
        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

app.put("/user/:id", verifyToken, (req, res) => {
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
            const token = jwt.sign({ user_id: newUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "1d" },);
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