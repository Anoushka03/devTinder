const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_DATA_SAFE = "firstName lastName emailId about";

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    const loggedInUser = req.user;

    try {
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_DATA_SAFE);

        if (connectionRequests.length == 0) {
            throw new Error("No request received");
        }

        console.log(connectionRequests);
        res.json({
            data: connectionRequests
        });
    } catch (error) {
        res.status(400).json({
            message: "Error: " + error
        })
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;

    try {
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted"},
                { toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_DATA_SAFE).populate("toUserId", USER_DATA_SAFE);

        if (connectionRequests.length == 0) {
            throw new Error("No connections");
        }

        const onlyConnectedUserData = connectionRequests.map(key => {
            if (key.fromUserId._id.toString() === loggedInUser._id.toString()) {
                console.log("yes")
                return key.toUserId;
            }
            return key.fromUserId;
        })

        res.json({
            data: onlyConnectedUserData
        });
    } catch (error) {
        res.status(400).json({
            message: "Error: " + error.message
        });
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const lmt = parseInt(req.query.limit) || 10;


    // In the feed we will not show those users who are already in connection with the loggedInUser or have sent or
    // the loggedInUser have sent connection request 
    // connection can be - accepted, interested, rejected, ignored

    try {
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).populate("fromUserId", "firstName")
        .populate("toUserId", "firstName");

        const hiddenUsers = new Set();
        connectionRequests.forEach(req => {
            hiddenUsers.add(req.fromUserId._id);
            hiddenUsers.add(req.toUserId._id);
        });
        const feedUsers = await User.find({
            _id: { $nin: Array.from(hiddenUsers) }
        }).select("firstName").skip((page - 1) * lmt).limit(lmt);

        res.json({
            data: feedUsers
        });
    } catch (error) {
        res.status(400).json({
            message: "Error: " + error.message
        });
    }
});

module.exports = userRouter;