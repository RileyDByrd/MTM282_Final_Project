const mongoose = require('mongoose');

// var url = "mongodb://localhost";
var dbName = "ExpressMongo";
var url = "mongodb+srv://mtmAdmin:pcsJk94EOU75j3PE@cluster0-qs3w2.mongodb.net/" + dbName + "?retryWrites=true&w=majority";

// mongoose.connect(url + '/' + dbName, {
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ItemSchema = new Schema({
        category: String,
        name: String,
        imgPath: String,
        price: Number,
        desc: String
});

const UserSchema = new Schema(
    {
        _id: ObjectId,
        name: String,
        email: String,
        username: String,
        password: String,
        roles: Array
    }
)

const itemCollectionName = "Items";
const Item = mongoose.model("Item", ItemSchema, itemCollectionName);

const userCollectionName = "Users";
const User = mongoose.model("User", UserSchema, userCollectionName)

async function getItems() {
    try {
        let categories = await Item.find({}, function() {});

        return categories;
    } catch (err) {
        console.log("The category was not found.");
    }
}

async function getItemByID(id) {
    try {
        let item = await Item.findById(id);

        return item;
    } catch(err) {
        console.log("The item with that ID was not found.");
    }
}

async function createItem(category, name, imgPath, price, desc) {
    try {
        let newItem = new Item({category: category, name: name, imgPath: imgPath, price: price, desc: desc});
        let storedItem = await newItem.save();
        return storedItem;
    } catch(err) {
        console.log(err);
    }
}

function convertJSONToMongo() {
    let rawContent = fs.readFileSync("items.json");
    let parsedContent = JSON.parse(rawContent).categories;
    for(let cat of Object.keys(parsedContent)) {
        for(let item of Object.keys(parsedContent[cat])) {
            let jsItem = parsedContent[cat][item];
            jsItem["category"] = cat;
            jsItem["name"] = item;
            createItem(jsItem["category"], jsItem["name"], jsItem["imgPath"], jsItem["price"], jsItem["desc"]);
        }
    }
}

module.exports = function() {
    this.mongoose = mongoose;
    this.Item = Item;
    this.User = User;
    this.getItems = getItems;
    this.getItemByID = getItemByID;
    this.createItem = createItem;
    this.convertJSONToMongo = convertJSONToMongo;
};