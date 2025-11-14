const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/userAuth"); 
const authRouter = require("./auth");
const { assignData } = require("../utils/validateData");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(404).send("Error:" + error.message);
    }
})

authRouter.patch("/profile/edit", userAuth, async (req, res) => {
    // validate the req.body
    const ALLOWED_UPDATES = ["gender", "age", "about"];

    try {
        const isUpdateAllowed = Object.keys(req.body).every(key => ALLOWED_UPDATES.includes(key));

        if(!isUpdateAllowed) {
            throw new Error("Update not allowed on one or more field");
        }
        assignData(req);
        const user = req.user;

        await user.save();
        res.send("User updated successfully");
    } catch(error) {
        res.status(400).send("Error: " + error.message);
    }
})

authRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    // validate req.body
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    try {
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong");
        }

        if (password !== confirmPassword) {
            throw new Error("Password don't match");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        req.user.password = hashPassword;
        await req.user.save();
        res.send("Password changed successfully");
    } catch (error) {
        res.status(400).send("Error: " + error);
    }
})

module.exports = profileRouter;