// getting an instance of mongoose and mongoose.Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// setting up a mongoose model and passing it using module.exports
module.exports = mongoose.model(
    "Task",
    new Schema({
        content: String,
        projectId: { type: Schema.Types.ObjectId, ref: "Project" },
        isDone: { type: Boolean, default: false, _id: false },
    })
);
