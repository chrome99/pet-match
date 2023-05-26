const asyncHandler = require("express-async-handler");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require('path');
const { ObjectId } = require("mongodb");
const { Request } = require("../models/requests");
const { Message } = require("../models/messages");

module.exports = (io, socket) => {
    // send a new Message
    const sendMessage = asyncHandler(async (data) => {
        //create message
        const newMessage = new Message(data);
        const result = await newMessage.save()
        io.to(data.requestId).emit("sendMessage", result); //requestId is the room!

        //update request about new message
        const updateRequest = await Request.findById(newMessage.requestId)
        updateRequest.messages.push(newMessage._id);
        await updateRequest.save();
    })
  
    //add a new request
    const newRequest = asyncHandler(async (data) => {
        const { title, body, userId, userName, requestId } = data;
        if (!(title && body && userId && userName)) {
            throw Error("All input is required");
        }

        const newMessageId = new ObjectId();
        const newRequestId = new ObjectId(requestId);
        const newFirstMsg = new Message({_id: newMessageId, requestId: newRequestId, userId: userId, userName: userName, value: body}) 
        const newRequest = new Request({_id: newRequestId, messages: [newMessageId], title: title, userId: userId, state: "bot"})
        requestResult = await newRequest.save()
        msgResult = await newFirstMsg.save()
        requestResult.messages = [msgResult];
        //sending new request to userId room, because user is not listening on this request (he does not have the new request id)
        io.to(userId).emit("newRequest", requestResult);
        botAnswer(msgResult);
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

        let newUnattendedRequest = false;
        if (request.state === "bot" && value === "unattended") {
            newUnattendedRequest = true;
        }

        switch (value) {
            case "open":
                request.adminId = adminId;
                request.assignedAdminAt = new Date();
                request.state = value;
                break;
            case "closed":
            case "bot":
                request.state = value;
                break;
            case "unattended":
                request.adminId = "";
                request.state = value;
                break;
            default:
                throw Error("Invalid value (open | closed | unattended)");
        }

        const result = await request.save();
        io.to(id).emit("changeReqState", data);
        //if new unattended request (bot to unattended), notify admins about it so they can listen to this request
        if (newUnattendedRequest) {
            const populatedResult = await result.populate('messages');
            io.to("adminsRoom").emit("newRequest", populatedResult);
        }
    })

    //requesting chat-gpt bot to answer this message
    const botAnswer = async (data) => {
        const openAi = new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPEN_AI_API_KEY,
        })
        )
        const contextData = fs.readFileSync(path.resolve(__dirname, "../data/contextdata.txt"), "utf8");

        try {
            const response = await openAi.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                { role: "user", content: "you are a virtual assitent on a Pet Adoption website. I will ask you questions based on the following data. make sure the answers are short and concise. data: " + contextData },
                { role: "user", content: data.value }
                ],
            })
            const botResponse = response.data.choices[0].message.content;
            //bot has his own user so potentially he can have a profile, bio, image, etc.
            const newBotMsg = {requestId: data.requestId, userId: "646e1ec676f95c539fe79f48", userName: "Chat-GPT Bot", value: botResponse}; 
            sendMessage(newBotMsg);
        }
        catch {
            sendError({destination: data.requestId, value: "Chat error. Please send your message again at a later date."})
        }
    }

    const sendError = asyncHandler(async (data) => {
        io.to(data.destination).emit("error", data.value);
    })

    //join a specific room (room name is request id)
    const joinRoom = asyncHandler(async (data) => {
        socket.join(data);
    })
  
    socket.on("sendMessage", sendMessage);
    socket.on("botAnswer", botAnswer);
    socket.on("newRequest", newRequest);
    socket.on("changeReqState", changeReqState);
    socket.on("joinRoom", joinRoom);
}