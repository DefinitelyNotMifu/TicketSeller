const express = require("express");
const {
    authRegister,
    authLogin,
    requestRefreshToken,
    userLogout,
} = require("../controllers/authController");

const { verifyToken } = require("../middlewares/middlewareController");

const router = express.Router();

// REGISTER
router.post("/register", authRegister);

// LOGIN
router.post("/login", authLogin);

// REFRESH TOKEN
router.post("/refresh", requestRefreshToken);

// LOGOUT
router.post("/logout", verifyToken, userLogout);

module.exports = router;
