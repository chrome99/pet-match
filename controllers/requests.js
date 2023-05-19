const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const { Request } = require("../models/requests");
const { Message } = require("../models/messages");

//get all unattended requests
exports.getUnattended = asyncHandler(async (req, res) => {
    const allUnattendedRequests = await Request.find({state: "unattended"}).populate('messages');
    res.status(200).send(allUnattendedRequests);
});

//get all requests made by user (filter requests by user id)
exports.getByUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const allUserRequests = await Request.find({userId: id}).populate('messages');
    res.status(200).send(allUserRequests);
});

//get all requests handled by admin (filter requests by admin id)
exports.getByAdmin = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const adminRequests = await Request.find({adminId: id}).populate('messages');
    res.status(200).send(adminRequests);
});

//get messages by request id
exports.getMessages = asyncHandler(async (req, res) => {
    const id = req.params.id;
    result = await Message.find({requestId: id})
    res.status(200).send(result);
});
