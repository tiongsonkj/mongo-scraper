var cheerio = require("cheerio");
var request = require("request");

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

