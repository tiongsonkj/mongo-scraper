// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");
var logger = require("morgan");
var bodyParser = require("body-parser");

// initialize express
var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// database configurations
var databaseUrl = "hw_scraper"
var collections = ["nba_hw"];

// hook mongo js configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error: ", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send(index.html);
});

// get all the data from the database 
app.get("/all", function(request, response) {
    // find all results from the nba_hw collection in the db
    db.nba_hw.find({}, function(error, found) {
        // throw any errors to the console.
        if (error) {
            console.log(error);
        }
        // if there are no errors, send the data to the browser as json
        else {
            response.json(found);
        }
    });
});

// scrape the data from one site and place it into the mongodb database
app.get("/scrape", function(req, res) {
    // make a request for the news section of nba.com
    request("http://www.nba.com", function(error, response, html) {

        var $ = cheerio.load(html);

        // empty array to save the data
        var results = [];

        $("a.content_list--item").each(function(i, element) {

            var link = $(element).attr("href");
            var title = $(element).children().text();

            results.push({
                title: title,
                link: link
            });

            // if this found element had both title and link
            if (title && link) {
                // insert the data in the nba_hw database
                db.nba_hw.insert({
                    title: title,
                    link: link
                },
                function(error, inserted) {
                    if (error) {
                        // log the error if one is encountered during the query
                        console.log(error);
                    }
                    else {
                        // otherwise, log the inserted data
                        console.log(inserted);
                    }
                });
            }
        }); 
    });

    // send a "Scrape Complete" message to browser
    res.send("Scrape Complete");
});

// Listen on port 3030
app.listen(3030, function() {
    console.log("App running on port 3030!");
  });

request("http://www.nba.com", function(error, response, html) {

    var $ = cheerio.load(html);

    // empty array to save the data
    var results = [];

    $("a.content_list--item").each(function(i, element) {

        var link = $(element).attr("href");
        var title = $(element).children().text();

        results.push({
            title: title,
            link: link
        });
    });

    console.log(results);
});

