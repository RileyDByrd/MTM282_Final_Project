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

const IdeSchema = new Schema({
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
        age: Number,
        username: String,
        password: String,
        roles: Array,
        ide: Number,
        language: Number,
        theme: Number
    }
)

const ideCollectionName = "Ides";
const Ide = mongoose.model("Ide", IdeSchema, ideCollectionName);

const userCollectionName = "Users";
const User = mongoose.model("User", UserSchema, userCollectionName)

async function getIdes() {
    try {
        let categories = await Ide.find({}, function() {});

        return categories;
    } catch (err) {
        console.log("The category was not found.");
    }
}

async function getIdeByID(id) {
    try {
        let ide = await Ide.findById(id);

        return ide;
    } catch(err) {
        console.log("The ide with that ID was not found.");
    }
}

async function createIde(category, name, imgPath, price, desc) {
    try {
        let newIde = new Ide({category: category, name: name, imgPath: imgPath, price: price, desc: desc});
        let storedIde = await newIde.save();
        return storedIde;
    } catch(err) {
        console.log(err);
    }
}

async function findQuestionAnswers() {
    var separatedResponses = {
        ideChoices: {1: 0, 2: 0, 3: 0, 4: 0},
        languageChoices: {1: 0, 2: 0, 3: 0, 4: 0},
        themeChoices: {1: 0, 2: 0, 3: 0, 4: 0}
    };

    await User.find({}, "ide language theme", function(err, docs) {
        if(typeof err != "undefined" && err != null) console.log(err);

        for(var doc of docs) {
            ++separatedResponses.ideChoices[doc.ide];
            ++separatedResponses.languageChoices[doc.language];
            ++separatedResponses.themeChoices[doc.theme];
        }
    });

    return separatedResponses;
}

function convertJSONToMongo() {
    let rawContent = fs.readFileSync("ides.json");
    let parsedContent = JSON.parse(rawContent).categories;
    for(let cat of Object.keys(parsedContent)) {
        for(let ide of Object.keys(parsedContent[cat])) {
            let jsIde = parsedContent[cat][ide];
            jsIde["category"] = cat;
            jsIde["name"] = ide;
            createIde(jsIde["category"], jsIde["name"], jsIde["imgPath"], jsIde["price"], jsIde["desc"]);
        }
    }
}

module.exports = function() {
    this.mongoose = mongoose;
    this.Ide = Ide;
    this.User = User;
    this.getIdes = getIdes;
    this.getIdeByID = getIdeByID;
    this.createIde = createIde;
    this.findQuestionAnswers = findQuestionAnswers;
    this.convertJSONToMongo = convertJSONToMongo;
};
