const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        validate(value) {
            if (!["female", "male", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    "emailId": {
        type: String,
        required: true,
        //unique: true, // create index
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
        min: 18
    },
    "about": {
        type: String,
        default: "Tell about yourself"
    }
},
{ timestamps: true });

//schema methods
userSchema.methods.getJWT = async function () {
    // Use normal function since 'this' doesn't work in arrow function 
    const user = this;
    const token = await jwt.sign({_id : user._id}, "DEV@Tinder@123", {expiresIn: "1h"});
    return token;
}

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    return isPasswordValid;
}

userSchema.index({ emailId: -1});

module.exports = mongoose.model("User", userSchema);