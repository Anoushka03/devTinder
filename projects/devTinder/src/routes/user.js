const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

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

module.exports = userRouter;