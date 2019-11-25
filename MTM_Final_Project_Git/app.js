const express = require("express");
const session = require("express-session");

var port = 3000;
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "spyMaster'sKey",
    cookie: { },
    resave: false,
    saveUninitialized: false
}));

var authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);
var businessRoutes = require("./routes/businessRoutes");
app.use("/", businessRoutes);
app.get("/", function(req, res) {
    var model = {
        tabTitle: "Reality Grab - Home",
        headingTitle: "Reality Grab®",
        desc: "Touch the other side.",
        username: req.session.username,
        isAdmin: req.session.isAdmin
    };
    res.render("index", model);
});

app.listen(port, function() {
    console.log("Express started and listening on port " + port + ".");
});