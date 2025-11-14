const express = require("express");
const connectDB = require("./config/database");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/userAuth"); 

// middleware for parsing request from json to javascript object
app.use(express.json());
// This middleware is used to parse the cookies received from request
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

// Database should be connected successfully before starting up the server
connectDB().then(()=> {
    console.log("Connected to database");
    app.listen(7777, () => {
    console.log("server started at port 7777");
});
}).catch(() => {
    console.log("Couldn't connect to database");
});