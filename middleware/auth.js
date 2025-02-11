const jwt = require("jsonwebtoken");
const config = process.env;
const { User } = require("../models/users");
const { ObjectId } = require("mongodb");

async function adminOnly(req, res, next) {
  const id = req.headers["admin"];
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Id");
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).send("User Not Found");
  }
  if (user.admin !== true) {
    return res.status(400).send("Access Denied");
  }
  return next();
}

function verifyToken(req, res, next) {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(400).send("Missing Token");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
  return next();
};

module.exports = {verifyToken, adminOnly};