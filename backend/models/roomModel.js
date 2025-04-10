const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ví dụ: "Room 1", "Room 2"
    },
    type: {
        type: Number,
        enum: [1, 2], // 1: 100 ghế, 2: 60 ghế
        required: true,
    },
    seatCount: {
        type: Number,
        required: true,
    },
});

const Room = mongoose.model("Room", roomSchema);
