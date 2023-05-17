const express = require('express');
const router = express.Router();

const { ObjectId } = require("mongodb");
const { User } = require("../models/users");
const { verifyToken, adminOnly } = require("../middleware/auth");

//get all users
router.get("/", verifyToken, adminOnly, (req, res) => {
    User.find()
    .then(searchResult => {
        return res.status(200).send(searchResult);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    })
})

//get user by id
router.get("/:id", verifyToken, (req, res) => {
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
router.post("/admin", verifyToken, adminOnly, (req, res) => {
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

//update user by id
router.put("/:id", verifyToken, (req, res) => {
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

module.exports = router;