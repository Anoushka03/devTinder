const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

// middleware for parsing request from json to javascript object
app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Unable to process the request");
    }

});

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.find({"emailId": userEmail});
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});


// Database should be connected successfully before starting up the server
connectDB().then(()=> {
    console.log("Connected to database");
    app.listen(7777, () => {
    console.log("server started at port 7777");
});
}).catch(() => {
    console.log("Couldn't connect to database");
});