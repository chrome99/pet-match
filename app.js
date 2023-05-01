const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./userSchema");
const { Pet } = require("./petSchema");
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