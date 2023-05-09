const mongoose = require("mongoose");

const rString = {type: String, required: true}
const requestSchema = new mongoose.Schema({
    title: rString,
    userId: rString,
    state: {type: String, enum: ['open', 'closed', 'unattended'], required: true},
    adminId: String,
}, {timestamps: true});

const Request = mongoose.model("Request", requestSchema);
module.exports = {Request};