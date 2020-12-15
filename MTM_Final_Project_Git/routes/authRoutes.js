const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require("../database")();

const router = express.Router();

router.route("/Register").get(async function(req, res) {
    var model = {
        css2link: "/css/order.css",
        title: "Register a New Account",
        desc: "Please set up a new account."
    }

    res.render("register", model);
});

router.route("/Register").post(function (req, res) {
    var password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        var newUser = new User(
            {
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: hash,
                roles: ["User"],
                isActive: true,
                ide: req.body.resp,
                language: req.body.resp2,
                theme: req.body.resp3
            }
        );
        newUser.save();
    });

    res.redirect("/Login");
});

router.route("/Login").get(function(req, res) {
    var model = {
        css2link: "/css/order.css",
        title: "Login Page",
        desc: "Enter your credentials.",
        username: req.session.username,
        userId: req.session.userId,
        isAdmin: req.session.isAdmin
    };

    res.render("login", model);
});

router.route("/Login").post(async function(req, res) {
    var user = await User.findOne({username: req.body.username});
    var valid = false;
    
    if(user && user.isActive) {
        valid = await bcrypt.compare(req.body.password, user.password);
    }

    if(user && valid) {
        // console.log(user);
        req.session.username = user.username;
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.isAdmin = user.roles.includes("Admin");
        req.session.ide = user.ide;
        req.session.language = user.language;
        req.session.theme = user.theme;

        res.redirect("/Ides");
    } else {
        req.session.username = null;
        req.session.userId = null;
        req.session.isAdmin = null;

        var model = {
            title: "Login Page",
            message: "Failed Login!",
            css2link: "/css/order.css",
            desc: "Enter your credentials.",
            username: req.session.username,
            userId: req.session.userId,
            isAdmin: req.session.isAdmin
        };

        res.render("login", model);
    }
});

router.route("/Logout").get(function(req, res) {
    req.session.username = null;
    req.session.userid = null;
    req.session.isAdmin = null;

    res.redirect("/");
});

router.route("/Admin").get(async function (req, res) {
    if(!req.session.isAdmin){
        res.redirect("/");
    } else {
        var UsersFromDB = await User.find();

        var model = {
            css2link: "/css/profile.css",
            title: "Admin CP",
            users: UsersFromDB,
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin,
            ide: req.session.ide,
            language: req.body.resp2,
            theme: req.body.resp3
        };
        res.render("admin", model);
    }
});

router.route("/ToAdmin/:userId").get(async function (req, res) {
    if(!req.session.isAdmin) {
        res.redirect("/");
    } else {
        var userId = req.params.userId;
        var user = await User.findOne({_id: userId});
        if(!user.roles.includes("Admin")) {
            user.roles.push("Admin");
            User.findByIdAndUpdate(userId, Object(user), {useFindAndModify: false}, function(err, doc) {
                if(err) console.log("There is an error.");
                console.log(doc);
            });
        }
        res.redirect("/Admin");
    }
});

router.route("/unAdmin/:userId").get(async function (req, res) {
    var userId = req.params.userId;
    if(!req.session.isAdmin || req.session.userId == userId) {
        res.redirect("/");
    } else {
        var user = await User.findOne({_id: userId});
        if(user.roles.includes("Admin")) {
            user.roles = "User";
            User.findByIdAndUpdate(userId, Object(user), {useFindAndModify: false}, function(err, doc) {
                if(err) console.log("There is an error.");
                console.log(doc);
            });
        }
        res.redirect("/Admin");
    }
});

router.route("/toggleActive/:userId").get(async function (req, res) {
    if(!req.session.isAdmin) {
        res.redirect("/");
    } else {
        var userId = req.params.userId;
        var user = await User.findOne({_id: userId});
        user.isActive = !user.isActive;
        User.findByIdAndUpdate(userId, Object(user), {useFindAndModify: false}, function(err, doc) {
            if(err) console.log("There is an error.");
            console.log(doc);
        });
        res.redirect("/Admin");
    }
});

router.route("/user").get(
    async function (req, res) {
        if(!req.session.username) {
            res.redirect("/");
        } else {
            var userId = req.session.userId;
            var user = await User.findOne({_id:userId});
            console.log(user)
            if (user) {
                var model = {
                    title: "User Profile",
                    user,
                    username: req.session.username,
                    userId: req.session.userId,
                    isAdmin: req.session.isAdmin,
                    ide: req.session.ide,
                    //////////////
                    language: req.session.language,
                    theme: req.session.theme
                }
                res.render("profile", model);

            } else {
                res.send("You done messed up! Could not find a user with id: " + userId);
            }
        }
    }
);

module.exports = router;
