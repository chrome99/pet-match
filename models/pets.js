const mongoose = require("mongoose");

const rString = {type: String, required: true}
const rNumber = {type: Number, required: true}
const rBoolean = {type: Boolean, required: true}
const petSchema = new mongoose.Schema({
    type: {type: String, enum: ['Cat', 'Dog'], required: true},
    name: rString,
    adoptionStatus: {type: String, enum: ['Fostered', 'Adopted', 'Available'], required: true},
    picture: rString,
    height: rNumber,
    weight: rNumber,
    color: rString,
    bio: String,
    hypoallergnic: rBoolean,
    dietery: {type: Array, required: true},
    breed: rString,
}, {timestamps: true});

const Pet = mongoose.model("Pet", petSchema);
module.exports = {Pet};