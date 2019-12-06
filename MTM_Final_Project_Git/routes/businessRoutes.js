const express = require("express");

require("../database")();

const router = express.Router();

router.route("/Ides").get(function(req, res) {
    getIdes().then(function(ides) {
        // convertJSONToMongo();
        var column0 = [];
        var column1 = [];
        var column2 = [];
        var ideKeys = Object.keys(ides);

        for(let i = 0; i < ideKeys.length; i++) {
            switch(i % 3) {
                case 0:
                    column0.push(ides[ideKeys[i]]);
                    break;
                case 1:
                    column1.push(ides[ideKeys[i]]);
                    break;
                case 2:
                    column2.push(ides[ideKeys[i]]);
            }
        }

        var model = {
            column0,
            column1,
            column2,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            css2link: "/css/items.css",
            title: "Shop for IDEs",
            desc: "All IDEs"
        };
        res.render("Items", model);
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
            title: "New IDE",
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

router.route("/submitForm").post(
    async function (req, res) {
        if(!req.session.username) {
            res.redirect("/");
        } else {
            var userId = req.session.userId;
            var user = await User.findOne({_id:userId});
            //
            var result = req.body.resp;
            var result2 = req.body.resp2;
            var result3 = req.body.resp3;
            user.ide = result;
            user.language = result2;
            user.theme = result3;
            req.session.ide = result;
            req.session.language = result2;
            req.session.theme = result3;
            //
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
                    ide: req.body.resp,
                    //////////////
                    language: req.body.resp2,
                    theme: req.body.resp3
                }
                res.render("profile", model);
            }
        }
    }
)


module.exports = router;
