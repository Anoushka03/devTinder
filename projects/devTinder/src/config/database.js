const mongoose = require("mongoose");

const connectDB = async () => {
    // This string connects to cluster - mongodb://localhost:27017/
    // This string connects to database - mongodb://localhost:27017/devTinder
    await mongoose.connect("mongodb+srv://anoushka:ZbCuNQIAr66q6ttV@cluster0.zfakb.mongodb.net/?appName=Cluster0");
};

module.exports = connectDB;
