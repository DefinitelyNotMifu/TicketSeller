const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const router = express.Router();
const {
    verifyToken,
    verifyTokenandAdminAuth,
} = require("../middlewares/middlewareController");

// GET ALL USERS
router.get("/", verifyToken, getAllUsers);

// DELETE
router.delete("/:id", verifyTokenandAdminAuth, deleteUser);

module.exports = router;
