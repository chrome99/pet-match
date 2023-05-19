const express = require('express');
const router = express.Router();

const { verifyToken, adminOnly } = require("../middleware/auth");
const RequestsController = require('../controllers/requests');

//get all unattended requests
router.get("/unattended", verifyToken, adminOnly, RequestsController.getUnattended);

//get all requests made by user (filter requests by user id)
router.get("/:id", verifyToken, RequestsController.getByUser);

//get all requests handled by admin (filter requests by admin id)
router.get("/admin/:id", verifyToken, adminOnly, RequestsController.getByAdmin);

//get messages by request id
router.get("/messages/:id", verifyToken, RequestsController.getMessages)

module.exports = router;