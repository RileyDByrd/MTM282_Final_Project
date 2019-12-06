const express = require("express");
const session = require("express-session");
require("./database")();

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
    findQuestionAnswers().then(function(questionAnswers) {
        console.log(questionAnswers);
        var model = {
            css2link: "css/index.css",
            tabTitle: "Ideal IDE - Home",
            headingTitle: "Ideal IDE®",
            desc: "Code best.",
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            ideData: questionAnswers.ideChoices,
            languageData: questionAnswers.languageChoices,
            themeData: questionAnswers.themeChoices
        };
        res.render("index", model);
    });
});

app.listen(port, function() {
    console.log("Express started and listening on port " + port + ".");
});