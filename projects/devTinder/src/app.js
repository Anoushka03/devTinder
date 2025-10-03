const express = require("express");

const app = express();

// Order of the request handlers matter because it starts checking from top to bottom and matched with the first
// matching handler
// if we keep "/" at the top then all the request will match this and no other routing will happen
// The function inside app.use is called request handler


app.get("/user", (req, res) => {
    res.send("get User");
});

app.post("/user", (req, res) => {
    res.send("post User");
});

app.patch("/user", (req, res) => {
    res.send("patch User");
});

app.delete("/user", (req, res) => {
    res.send("delete User");
});

/*
    If we use route "/hello123" then it will go to "/" route since after hello also it has some chars
    But, if it was "/hello/234" then it will go to "/hello"
*/
app.use("/hello/2", (req, res) => {
    res.send("hello hello");
});

app.use("/hello", (req, res) => {
    res.send("hello");
});



app.use("/test", (req, res) => {
    res.send("testing");
});

app.use("/", (req, res) => {
    res.send("Landing page");
});

app.listen(7777, () => {
    console.log("server started at port 7777");
});