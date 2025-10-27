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
        res.status(400).send("Unable to process the request:" + err.message);
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

app.get("/id", async (req, res) => {
    try {
        const user = await User.findById("68e970e4c531293f13d848e0");
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});

app.patch("/update", async (req, res) => {
    
    const ALLOWED_UPDATES = ["gender", "password", "age", "about", "userID"];

    try {

        const isUpdateAllowed = Object.keys(req.body).every(k => ALLOWED_UPDATES.includes(k));
        console.log(isUpdateAllowed);
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed on the given field");
        }
        // validate functions do not work automatically with update api we have specify the attribute called
        // runValidators to make validate function work on update as well
        const user = await User.updateOne({_id: req.body.userID}, req.body, { runValidators: true });
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }
})

app.put("/update/:name", async (req, res) => {
    try {
        const user = await User.updateOne({"firstName": req.params.name}, {$set: req.body});
        res.send(user);
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