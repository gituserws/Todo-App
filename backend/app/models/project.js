// getting an instance of mongoose and mongoose.Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// setting up a mongoose model and passing it using module.exports
module.exports = mongoose.model(
    "Project",
    new Schema({
        name: String
    })
);
