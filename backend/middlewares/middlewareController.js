const cloudinary = require("../controllers/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const jwt = require("jsonwebtoken");

// VERIFY TOKEN
const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, user) => {
            if (error) {
                res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated");
    }
};

// VERIFY TOKEN WITH ADMIN AUTHENTICATED
const verifyTokenandAdminAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.admin) {
            next();
        } else {
            res.status(403).json("You are not allowed to delete other");
        }
    });
};

// Cấu hình Multer để lưu ảnh lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "donation-app", // Thư mục lưu ảnh trên Cloudinary
        format: async (req, file) => "jpg", // Định dạng ảnh
        public_id: (req, file) => file.originalname,
    },
});

module.exports = { verifyToken, verifyTokenandAdminAuth, storage };
