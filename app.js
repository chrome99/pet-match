const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

const setupSocket = require("./sockets/chat");

const requestsRoute = require("./routes/requests");
const petsRoute = require("./routes/pets");
const usersRoute = require("./routes/users");
const wishlistsRoute = require("./routes/wishlists");
const authRoute = require("./routes/auth");

const URI = process.env.URI;
const PORT = process.env.PORT;

/*
todo:
throughly test backend!
connect chat socket with controller perhaps
validate all incoming user input using middleware (for each schema)
use global middleware for user and admin (with exceptions)
use seperate endpoint for file upload

fix bug where user can adopt pet, but then admin can make pet available - 
    make sure that if the pet is made available to also remove it from the
    user's pet's list.

*/

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://pet-adoption-yhs3hgb6ly.netlify.app']
}));

app.use('/request', requestsRoute);
app.use('/pet', petsRoute);
app.use('/user', usersRoute);
app.use('/wishlist', wishlistsRoute);
app.use('/auth', authRoute);

main();

async function main () {
    try {
        await mongoose.connect(URI);
        console.log("connected to db");
        const server = app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`)
            setupSocket(server);
        })
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}