const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validateData");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    // Validate the data
    validateSignupData(req.body);

    const {firstName, lastName, emailId, password} = req.body;
    // encrypt the password
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword
    });
    try {
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Unable to process the request:" + err.message);
    }

});

authRouter.post("/login", async (req, res) => {
    const {emailId, password} = req.body;

    try {
        // validate the data
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }

        // check is email id is present in DB or not

        const user = await User.findOne({"emailId": emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = user.validatePassword(password);
        if(!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        // Create a JWT token
        const token = await user.getJWT();

        console.log("before sending token: ", token);
        // Add token to the cookie and send cookie back to the user
        res.cookie("token", token);

        res.send("Login successfull");
    } catch (err) {
        res.status(404).send("Error:" + err.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    res.clearCookie("token", null, {expires: new Date(0)});
    res.send("logout successfull");
})

module.exports = authRouter;