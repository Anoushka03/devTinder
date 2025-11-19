const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = mongoose.Schema({
    "fromUserId": {
        type: mongoose.ObjectId,
        required: true,
        ref: User
    },
    "toUserId": {
        type: mongoose.ObjectId,
        required: true,
        ref: User
    },
    "status": {
        type: String,
        enum: ["accepted", "rejected", "interested", "ignored"]
    }
});

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }

    next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);