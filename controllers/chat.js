const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const { Request } = require("../models/requests");
const { Message } = require("../models/messages");

module.exports = (io, socket) => {
    // send a new Message
    const sendMessage = asyncHandler(async (data) => {
        //create message
        const newMessage = new Message(data);
        const result = await newMessage.save()
        io.to(result.requestId).emit("sendMessage", result); //requestId is the room!

        //update request about new message
        const updateRequest = await Request.findById(newMessage.requestId)
        updateRequest.messages.push(newMessage._id);
        await updateRequest.save();
    })
  
    //add a new request
    const newRequest = asyncHandler(async (data) => {
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

    //change request status
    const changeReqState = asyncHandler(async (data) => {
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

    //join a specific room (room name is request id)
    const joinRoom = asyncHandler(async (data) => {
        socket.join(data);
    })
  
    socket.on("sendMessage", sendMessage);
    socket.on("newRequest", newRequest);
    socket.on("changeReqState", changeReqState);
    socket.on("joinRoom", joinRoom);
}