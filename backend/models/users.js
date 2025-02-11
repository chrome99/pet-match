const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const rString = {type: String, required: true, maxLength: 20}
const rBoolean = {type: Boolean, required: true}
const userSchema = new mongoose.Schema({
    firstName: rString,
    lastName: rString,
    phone: rString,
    email: {type: String, required: true, lowercase: true, unique: true, maxLength: 50},
    password: {type: String, required: true, min: 8, maxLength: 100},
    bio: { type: String, maxLength: 500 },
    admin: rBoolean,
    token: { type: String },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true}]
}, {timestamps: true});


userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, encryptedPass) {
            if (err) {
                return next(err);
            }
            user.password = encryptedPass;
            next();
        });
    });
});
     
userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

const User = mongoose.model("User", userSchema);
module.exports = {User};