const mongoose = require("mongoose");

const connectDB = async () => {
    // This string connects to cluster - mongodb://localhost:27017/
    // This string connects to database - mongodb://localhost:27017/devTinder
    await mongoose.connect("mongodb://localhost:27017/devTinder");
};

module.exports = connectDB;
