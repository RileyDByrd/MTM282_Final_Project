const express = require("express");

require("../database")();

const router = express.Router();

router.route("/Ides").get(function(req, res) {
    getIdes().then(function(ides) {
        // convertJSONToMongo();
        var column0 = [];
        var column1 = [];
        var column2 = [];
        var itemKeys = Object.keys(items);

        for(let i = 0; i < itemKeys.length; i++) {
            switch(i % 3) {
                case 0:
                    column0.push(items[itemKeys[i]]);
                    break;
                case 1:
                    column1.push(items[itemKeys[i]]);
                    break;
                case 2:
                    column2.push(items[itemKeys[i]]);
            }
        }
// columns
        var model = {
            ides,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            css2link: "/css/ides.css",
            title: "Shop for Ides",
            desc: "All Ides"
        };
        res.render("Ides", model);
    });
});

router.route("/Order").get(function(req, res) {
    if(req.session.username) {
        let ideID = req.body.ideID;
        if(!ideID) ideID = "";
        var model = {
            ideID,
            title: "Order",
            css2link: "/css/order.css",
            username: req.session.username,
            isAdmin: req.session.isAdmin
        }
    
        res.render("order", model);
    } else {
        res.redirect("/Login");
    }
});

router.route("/Order/:orderID").get(function(req, res) {
    let ideID = req.params.orderID;

    req.body.ideID = ideID;
    req.url = "/Order";
    router.handle(req, res);
});

router.route("/Order").post(function(req, res) {
    var model = new Object();
    Object.assign(model, Object(req.body));
    model.css2link = "/css/order_complete.css";
    model.username = req.session.username;
    model.isAdmin = req.session.isAdmin;
    
    res.render("order_complete", model);
});

router.route("/Ides/details/:ideID").get(function(req, res) {
    let ideID = req.params.ideID;
    
    getIdeByID(ideID).then(function(ide) {
        let model = {
            css2link: "/css/ides.css",
            title: "Shop for Ides",
            ide,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            desc: ide.name
        };
        res.render("ide_details", model);
    });
});

router.route("/NewIde").get(function(req, res) {
    if(req.session.isAdmin) {
        var model = {
            title: "New Ide",
            css2link: "/css/order.css",
            username: req.session.username,
            isAdmin: req.session.isAdmin
        };
        res.render("new_ide", model);
    } else {
        res.redirect("/Login");
    }
});

router.route("/NewIde").post(function(req, res) {
    if(req.session.isAdmin) {
        createIde(req.body.category, req.body.name, req.body.imgPath, req.body.price, req.body.desc)
            .then(function(ide) {
                res.redirect("/Ides/details/" + ide._id);
            });
    } else {
        res.sendStatus(401);
    }
});
//
router.route("/Admin").get(async function (req, res) {
    if(!req.session.isAdmin){
        res.redirect("/");
    }else {
        var UsersFromDB = await User.find();

        var model = {
            css2link: "/css/profile.css",
            title: "Admin CP",
            users: UsersFromDB,
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin,
            ide: req.session.ide
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

router.route("/user").get(
    async function (req, res) {
        if(!req.session.username) {
            res.redirect("/");
        }else {
            var userId = req.session.userId;
            var user = await User.findOne({_id:userId});
            console.log(user)
            if (user) {
                var model = {
                    title: "User Profile",
                    user: user,
                    username: req.session.username,
                    userId: req.session.userId,
                    isAdmin: req.session.isAdmin,
                    ide: req.session.ide
                }
                res.render("profile", model);

            } else {
                res.send("You done messed up! Could not find a user with id: " + userId);
            }
        }
    }
);


router.route("/submitForm").post(
    async function (req, res) {
        if(!req.session.username) {
            res.redirect("/");
        }else {
            var userId = req.session.userId;
            var user = await User.findOne({_id:userId});
            var result = req.body.resp;
            req.session.ide = result;
            user.ide = result;
            User.findByIdAndUpdate(userId, Object(user), {useFindAndModify: false}, function(err, doc) {
                if(err) console.log("There is an error.");
                console.log(doc);
            });
            if (user) {
                var model = {
                    title: "User Profile",
                    user: user,
                    username: req.session.username,
                    userId: req.session.userId,
                    isAdmin: req.session.isAdmin,
                    ide: req.body.resp
                }
                res.render("profile", model);
            }
        }
    }
)


module.exports = router;
