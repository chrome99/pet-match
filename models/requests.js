const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 65},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    state: {type: String, enum: ['open', 'closed', 'unattended', 'bot'], required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, {timestamps: true});

const Request = mongoose.model("Request", requestSchema);
module.exports = {Request};