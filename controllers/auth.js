const asyncHandler = require("express-async-handler");
const { User } = require("../models/users");
const jwt = require("jsonwebtoken");


//register a new user
exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!(firstName && lastName && email && phone && password)) {
        return res.status(400).send("All input is required");
    }

    const emailExists = await User.findOne({ email })
    if (emailExists) {
        return res.status(400).send("Email already listed for other user.");
    }

    //if this is the first user, make user admin
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
        req.body.admin = true;
    }
    else {
        req.body.admin = false;
    }

    req.body.bio = "";
    req.body.pets = [];
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = jwt.sign({ user_id: savedUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "1d" },);
    savedUser.token = token;
    res.status(200).send(savedUser);
});

//login an existing user
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
    
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        res.status(400).send("Invalid Email");
        return;
    }

    user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
            const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h",});
            user.token = token;
            res.status(200).json(user);
        }
        else {
            res.status(400).send("Invalid Password");
            return;
        }                
    });
});
