const express = require('express');
const router = express.Router();

const { User } = require("../models/users");

const jwt = require("jsonwebtoken");

router.post('/register', (req, res) => {
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
  
router.post('/login', (req, res) => {
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

module.exports = router;