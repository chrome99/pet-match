const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users");
const { adminOnly } = require("../middleware/auth");

//all user routes go through the verifyToken middleware

//get all users (admin only)
router.get("/", adminOnly, UserController.getAll)

//get user by id
router.get("/:id", UserController.getById)

//add / remove user from admins
router.post("/admin", adminOnly, UserController.changeAdmin)

//update user by id
router.put("/:id", UserController.update);

module.exports = router;