const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/userAuth"); 
const { assignData } = require("../utils/validateData");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(404).send("Error:" + error.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
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

profileRouter.post("/profile/sendConnectionRequest/:status/:toUserId", userAuth, async (req, res) => {
    // Validate the data
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUser = req.user;
    const ALLOWED_STATUS = ["interested", "ignored"];
    try {
        const isValidStatus = ALLOWED_STATUS.includes(status);
        if(!isValidStatus) {
            throw new Error("Invalid status");
        }

        const user = await User.findById(toUserId);
        if(!user) {
            throw new Error("Invalid user");
        }

        const existingConnection = await ConnectionRequest.find({
            $or: [
                { fromUserId: fromUser._id, toUserId: toUserId },        // sent by you
                { fromUserId: toUserId, toUserId: fromUser._id }         // sent to you
            ]
        });

        if(existingConnection.length > 0) {
            throw new Error("Existing connection");
        }

        const newConnection = new ConnectionRequest({"fromUserId": fromUser._id, "toUserId": toUserId,
            "status": status
        });

        await newConnection.save();

        res.json({
            "message": "Connection request successfull: " + status
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = profileRouter;