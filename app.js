const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const cors = require('cors');
const dotenv = require("dotenv").config();

const requestsRoute = require("./routes/requests");
const petsRoute = require("./routes/pets");
const usersRoute = require("./routes/users");
const wishlistsRoute = require("./routes/wishlists");
const authRoute = require("./routes/auth");

const { Message } = require("./models/messages");
const { Request } = require("./models/requests");
const { verifyToken, adminOnly } = require("./middleware/auth");
const URI = process.env.URI;
const PORT = process.env.PORT;
const WEBSOCKETPORT = process.env.WEBSOCKETPORT;

const app = express();
/*
todo:
organize code into different folders
validate all incoming user input using middleware (for each schema)
use global middleware for user and admin (with exceptions)
use seperate endpoint for file upload

fix bug where user can adopt pet, but then admin can make pet available - 
    make sure that if the pet is made available to also remove it from the
    user's pet's list.

*/
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/request', requestsRoute);
app.use('/pet', petsRoute);
app.use('/user', usersRoute);
app.use('/wishlist', wishlistsRoute);
app.use('/auth', authRoute);

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
    connectToMongodb();
})

async function connectToMongodb () {
    try {
        await mongoose.connect(URI);
        console.log("connected to db"); connectToSocketIo();
    }
    catch (err) {
        console.log(err);
    }
}

function connectToSocketIo() {
    const io = require('socket.io')(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });
    io.on("connection", (socket) => {
        
      // if message sent, send the message to everyone on a room chat
      socket.on("sendMessage", async (data) => {
        //add to db
        try {
            //create message
            const newMessage = new Message(data);
            const result = await newMessage.save()
            io.to(result.requestId).emit("sendMessage", result); //requestId is the room!

            //update request about new message
            const updateRequest = await Request.findById(newMessage.requestId)
            updateRequest.messages.push(newMessage._id);
            await updateRequest.save();
        }
        catch(err) {
            console.log(err)
        }
      })

      socket.on("newRequest", async (data) => {
        const { title, body, userId, userName } = data;
        if (!(title && body && userId && userName)) {
            throw Error("All input is required");
        }

        const newMessageId = new ObjectId();
        const newRequestId = new ObjectId();
        const newFirstMsg = new Message({_id: newMessageId, requestId: newRequestId, userId: userId, userName: userName, value: body}) 
        const newRequest = new Request({_id: newRequestId, messages: [newMessageId], title: title, userId: userId, state: "unattended"})
        requestResult = await newRequest.save()
        msgResult = await newFirstMsg.save()
        requestResult.messages = [msgResult];
        io.emit("newRequest", requestResult);
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
        io.to(id).emit("changeReqState", data);
      })

      // Join the user to a socket room
      socket.on('joinRoom', (data) => {
        socket.join(data);
      });
    });
}