const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    userName: {type: String, required: true, maxLength: 40},
    value: {type: String, required: true, maxLength: 500}
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);
module.exports = {Message};