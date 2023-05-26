const express = require('express');
const router = express.Router();

const { adminOnly } = require("../middleware/auth");
const RequestsController = require('../controllers/requests');

//all request routes go through the verifyToken middleware

//get all unattended requests
router.get("/unattended", adminOnly, RequestsController.getUnattended);

//get all requests made by user (filter requests by user id)
router.get("/:id", RequestsController.getByUser);

//get all requests handled by admin (filter requests by admin id)
router.get("/admin/:id", adminOnly, RequestsController.getByAdmin);

//get messages by request id
router.get("/messages/:id", RequestsController.getMessages)

module.exports = router;