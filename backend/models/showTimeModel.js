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
    time: {
        type: Date,
        required: true,
    },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);
