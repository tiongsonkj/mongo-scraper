// require mongoose
var mongoose = require("mongoose");

// create a Schema class with mongoose
var Schema = mongoose.Schema;

// make nbaSchema a Schema
var nbaSchema = new Schema ({
    // title
    title: String,
    // link of the nba article?
    link: String
});

// creates a model from the schema above, using mongoose's model method
var nbaNews = mongoose.model("nbaNews", nbaSchema);

// export the nbaNews model
module.exports = nbaNews;