const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies?.token;
        const authHeader = req.headers?.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return res.status(401).send("Please login");
        }

        const decodedMessage = jwt.verify(token, "DEV@Tinder@123");
        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).send("User does not exist");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Session expired. Please login again.");
        }
        return res.status(401).send("Invalid token");
    }
};

module.exports = {userAuth};
