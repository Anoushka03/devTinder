const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    "fromUserId": {
        type: mongoose.ObjectId,
        required: true
    },
    "toUserId": {
        type: mongoose.ObjectId,
        required: true
    },
    "status": {
        type: String,
        enum: ["accepted", "rejected", "interested", "ignored"]
    }
});

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }

    next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);