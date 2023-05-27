const mongoose = require("mongoose");

const rString = {type: String, required: true, maxLength: 20}
const rNumber = {type: Number, required: true, min: 10, max: 350}
const rBoolean = {type: Boolean, required: true}
const petSchema = new mongoose.Schema({
    type: {type: String, enum: ['Cat', 'Dog'], required: true},
    name: rString,
    adoptionStatus: {type: String, enum: ['Fostered', 'Adopted', 'Available'], required: true},
    picture: {type: String, required: true, maxLength: 130},
    height: rNumber,
    weight: rNumber,
    color: rString,
    bio: {type: String, maxLength: 500},
    hypoallergnic: rBoolean,
    dietery: {type: Array, required: true},
    breed: {type: String, required: true, maxLength: 40},
}, {timestamps: true});

const Pet = mongoose.model("Pet", petSchema);
module.exports = {Pet};