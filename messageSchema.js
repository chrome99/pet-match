const mongoose = require("mongoose");

const rString = {type: String, required: true}
const messageSchema = new mongoose.Schema({
    _id: rString,
    room: rString,
    userId: rString,
    userName: rString,
    createdAt: {type: Date, required: true},
    value: rString
});

const Message = mongoose.model("Message", messageSchema);
module.exports = {Message};