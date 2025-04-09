const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const feedbackRoute = require("./routes/feedback");
const blogRoute = require("./routes/blog");
const donate = require("./routes/donate");
const distribution = require("./routes/distribution");
const donationTotal = require("./routes/donationTotal");
const campaignRoute = require("./routes/campaign");

const cron = require("node-cron");
const { scrapeWeatherData } = require("./controllers/blogController");

dotenv.config();
const app = express();

// Tạo HTTP server từ Express app
const http = require("http").createServer(app);

// Tích hợp socket.io vào HTTP server
const io = require("socket.io")(http, {
    cors: { origin: "*" }, // Cấu hình CORS để cho phép mọi nguồn truy cập
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connect to MongoDB Atlas successfully!");
        scrapeWeatherData();
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
app.use("/feedback", feedbackRoute);
app.use("/blog", blogRoute);
app.use("/donate", donate);
app.use("/distribution", distribution);
app.use("/donationTotal", donationTotal);
app.use("/campaign", campaignRoute);

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
