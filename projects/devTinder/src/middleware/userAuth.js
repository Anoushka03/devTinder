const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    const cookie = req.cookies;
    const {token} = cookie;

    if(!token) {
        throw new Error("Invalid token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder@123");

    const {_id} = decodedMessage;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("User does not exists");
    }

    req.user = user;
    next();
}

module.exports = {userAuth};