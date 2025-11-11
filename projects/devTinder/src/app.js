const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const validateSignupData = require("./utils/validateData");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/userAuth"); 

// middleware for parsing request from json to javascript object
app.use(express.json());
// This middleware is used to parse the cookies received from request
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    // Validate the data
    validateSignupData(req.body);

    const {firstName, lastName, emailId, password} = req.body;
    // encrypt the password
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword
    });
    try {
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Unable to process the request:" + err.message);
    }

});

app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;

    try {
        // validate the data
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }

        // check is email id is present in DB or not

        const user = await User.findOne({"emailId": emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = user.validatePassword(password);
        if(!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        // Create a JWT token
        const token = user.getJWT();

        // Add token to the cookie and send cookie back to the user
        res.cookie("token", token, {expires: new Date(Date.now() + 60 * 60 * 1000)});

        res.send("Login successfull");
    } catch (err) {
        res.status(404).send("Error:" + err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(404).send("Error:" + error.message);
    }
})

app.post("/sendConnectionReq", userAuth, async (req, res) => {
    res.send("This user is sending request :" + req.user);
})

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