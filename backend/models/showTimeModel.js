const showtimeSchema = new mongoose.Schema({
    film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film",
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        enum: ["09:00-11:00", "14:00-16:00", "18:00-20:00", "20:30-22:30"],
        required: true,
    },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);
