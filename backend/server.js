const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();
const app = express();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connect to MongoDB Atlas successfully!");
    })
    .catch((err) => {
        console.log(err);
        console.error("Cannot connect to MongoDB");
    });

// ENABLES CORS
app.use(cors());

// COOKIE-PARSER
app.use(cookieParser());

// JSON PAYLOADS
app.use(express.json());

// ROUTES
app.use("/auth", authRoute);
app.use("/user", userRoute);

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
