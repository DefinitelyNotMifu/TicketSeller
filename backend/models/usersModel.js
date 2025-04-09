const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        admin: {
            type: Boolean,
            default: false,
        },
        isLicensedOrganization: {
            type: Boolean,
            default: false,
            required: function () {
                return this.role === "organization";
            },
        },
        organizationCertificate: {
            type: String,
            default: false,
            required: function () {
                return this.role === "organization";
            },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
