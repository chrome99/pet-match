const express = require('express');
const router = express.Router();

const { ObjectId } = require("mongodb");
const { Request } = require("../models/requests");
const { Message } = require("../models/messages");
const { verifyToken, adminOnly } = require("../middleware/auth");

//get all unattended requests
router.get("/unattended", verifyToken, adminOnly, async (req, res) => {
    const allUnattendedRequests = await Request.find({state: "unattended"}).populate('messages');
    res.status(200).send(allUnattendedRequests);
})

//get all requests made by user (get by user id)
router.get("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const allUserRequests = await Request.find({userId: id}).populate('messages');
    res.status(200).send(allUserRequests);
})

//get all requests handled by admin
router.get("/admin/:id", verifyToken, adminOnly, async (req, res) => {
    const id = req.params.id;

    const adminRequests = await Request.find({adminId: id}).populate('messages');
    res.status(200).send(adminRequests);
})

//get messages by request id
router.get("/messages/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    result = await Message.find({requestId: id})
    res.status(200).send(result);
})

//post new request
router.post("/", verifyToken, async (req, res) => {
    const { title, body, userId, userName } = req.body;
    if (!(title && body && userId && userName)) {
        return res.status(400).send("All input is required");
    }

    const newMessageId = new ObjectId();
    const newRequestId = new ObjectId();
    const newFirstMsg = new Message({_id: newMessageId, requestId: newRequestId, userId: userId, userName: userName, value: body}) 
    const newRequest = new Request({_id: newRequestId, messages: [newMessageId], title: title, userId: userId, state: "unattended"})
    requestResult = await newRequest.save()
    msgResult = await newFirstMsg.save()
    requestResult.messages = [msgResult];
    res.status(200).send(requestResult);
})

//update request state (open, close, unattended)
//unattended means that the admins has abandoned the request
router.put("/", verifyToken, adminOnly, async (req, res) => {
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

module.exports = router;