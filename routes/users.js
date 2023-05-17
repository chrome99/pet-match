const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users");
const { verifyToken, adminOnly } = require("../middleware/auth");

//get all users (admin only)
router.get("/", verifyToken, adminOnly, UserController.getAll)

//get user by id
router.get("/:id", verifyToken, UserController.getById)

//add / remove user from admins
router.post("/admin", verifyToken, adminOnly, UserController.changeAdmin)

//update user by id
router.put("/:id", verifyToken, UserController.update);

module.exports = router;