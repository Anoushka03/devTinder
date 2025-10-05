const express = require("express");

const app = express();


// Playing with the routes
// This route means the char before + can be written n (n > 0) number of times
// app.get(/user+a/, (req, res) => {
//     //console.log(req.query);
//     res.send("get User regex");
// });


// Match to anything in between user and a "/user2345a"
// app.get(/user.*a$/, (req, res) => {
//     //console.log(req.query);
//     res.send("get User regex");
// });





// In this ? means it will match the char before ? and that char can appear 0 or 1 time
// app.get(/user?a/, (req, res) => {
//     //console.log(req.query);
//     res.send("get User regex");
// });











// It matches exactly with userba and () is capturing group so it will appear in req.params
// app.get(/user(b)a/, (req, res) => {
//     console.log(req.params);
//     res.send("get User regex");
// });










// it match any path that contains a
app.get(/a/, (req, res) => {
    console.log(req.params);
    res.send("get User regex");
});

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