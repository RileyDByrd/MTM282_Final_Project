const express = require("express");

require("../database")();

const router = express.Router();

router.route("/Items").get(function(req, res) {
    getItems().then(function(items) {
        // convertJSONToMongo();
        var model = {
            items,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            css2link: "/css/items.css",
            title: "Shop for Items",
            desc: "All Items"
        };
        res.render("items", model);
    });
});

router.route("/Order").get(function(req, res) {
    if(req.session.username) {
        let itemID = req.body.itemID;
        if(!itemID) itemID = "";
        var model = {
            itemID,
            title: "Order",
            css2link: "/css/order.css",
            username: req.session.username,
            isAdmin: req.session.isAdmin
        };
    
        res.render("order", model);
    } else {
        res.redirect("/Login");
    }
});

router.route("/Order/:orderID").get(function(req, res) {
    let itemID = req.params.orderID;

    req.body.itemID = itemID;
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

router.route("/Items/details/:itemID").get(function(req, res) {
    let itemID = req.params.itemID;
    
    getItemByID(itemID).then(function(item) {
        let model = {
            css2link: "/css/items.css",
            title: "Shop for Items",
            item,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            desc: item.name
        };
        res.render("item_details", model);
    });
});

router.route("/NewItem").get(function(req, res) {
    if(req.session.isAdmin) {
        var model = {
            title: "New Item",
            css2link: "/css/order.css",
            username: req.session.username,
            isAdmin: req.session.isAdmin
        };
        res.render("new_item", model);
    } else {
        res.redirect("/Login");
    }
});

router.route("/NewItem").post(function(req, res) {
    if(req.session.isAdmin) {
        createItem(req.body.category, req.body.name, req.body.imgPath, req.body.price, req.body.desc)
            .then(function(item) {
                res.redirect("/Items/details/" + item._id);
            });
    } else {
        res.sendStatus(401);
    }
});

// router.route("/user").get(
//     async function (req, res) {
//         if(!req.session.username) {
//             res.redirect("/");
//         }else {
//             var userId = req.session.userId;
//             var user = await User.findOne({_id:userId});
//             console.log(user)
//             if (user) {
//                 var model = {
//                     title: "User Profile",
//                     user: user
//                 }
//                 res.render("user", model);

//             } else {
//                 res.send("You done messed up! Could not find a user with id: " + userId);
//             }
//         }
//     }
// );

module.exports = router;
