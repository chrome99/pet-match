const mongoose = require("mongoose");

const rString = {type: String, required: true}
const messageSchema = new mongoose.Schema({
    requestId: rString,
    userId: rString,
    userName: rString,
    value: rString
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);
module.exports = {Message};