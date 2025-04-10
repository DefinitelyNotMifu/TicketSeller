const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Tham chiếu đến bảng User (nếu có hệ thống đăng nhập)
            required: true,
        },
        showtime: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Showtime", // Tham chiếu đến lịch chiếu đã định nghĩa
            required: true,
        },
        seats: {
            type: [String], // Ví dụ: ["A1", "A2", "B5"]
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "credit", "momo"],
            default: "cash",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
