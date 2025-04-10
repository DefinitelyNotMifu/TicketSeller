const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        genre: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        releaseDate: {
            type: Date,
            required: true,
        },
        director: {
            type: String,
            required: true,
            trim: true,
        },
        cast: {
            type: [String],
            required: true,
        },
        posterUrl: {
            type: String,
        },
        trailerUrl: {
            type: String,
        },
        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },
        isShowing: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Film = mongoose.model("Film", filmSchema);

module.exports = Film;
