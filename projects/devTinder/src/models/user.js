const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    "firstName": {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 20
    },
    "lastName": {
        type: String,
        trim: true
    },
    "gender": {
        type: String,
        required: true,
        validate(value) {
            if (!["female", "male", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    "emailId": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    "password": {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Not a strong password");
            }
        }
    },
    "age": {
        type: Number,
        required: true,
        min: 18
    },
    "about": {
        type: String,
        default: "Tell about yourself"
    }
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);