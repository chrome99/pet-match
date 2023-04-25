const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const { User } = require("./schemas");
const uri = "mongodb+srv://efeldman207:C5X7vtIRAirRz9Ad@stockexchange.yzb09kt.mongodb.net/petAdoption";
const PORT = 8080;

const app = express();

app.use(express.json());

mongoose.connect(uri)
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

//post new user
app.post('/users', (req, res) => {
    req.body.admin = false;
    const newUser = new User(req.body);
    newUser.save()
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
    });
});
  
app.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            res.status(400).send("Invalid Email");
            return;
        }

        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                res.status(200).send("ok");
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