// REQUIRED PACKAGES
// =====================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// SCRAPING TOOLS
// =====================
// axios is a promised-based HTTP library, similar to jQuery's Ajax method
// it works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// REQUIRE ALL MODELS
// =====================
var db = require("./models");

// PORT, ADD ONE FOR HEROKU VERSION
// =====================
var PORT = process.env.PORT || 3000;

// INITIALIZE EXPRESS
// =====================
var app = express();

// CONFIGURE MIDDLEWARE
// =====================
// use morgan logger for logging requests
app.use(logger("dev"));
// use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// CONNECT TO MONGODB
// =====================
var MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/newscraperdb";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ROUTES
// =====================
// html routes
// route for home page
app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// api routes
// route for getting all articles from the db
app.get("/api/articles", function(req, res) {
	// grab every document in the Articles collection
	db.Article.find({})
		.then(function(dbArticles) {
			// if we were able to successfully find Articles, send them back to the client
			res.json(dbArticles);
		})
		.catch(function(err) {
			// if an error occurred, send it to the client
			res.json(err);
		});
});

// route for particular article and its associated notes
app.get("/articles/:id", function(req, res) {
  // using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // if we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // if an error occurred, send it to the client
      res.json(err);
    });
});

// route for posting note to particular article


// route for clearing db
app.get("/api/clear", function(req, res) {
	db.Article.collection.drop();
	db.Note.collection.drop();

	// send success message
	res.send(200);
});

// scrape route
app.get("/api/scrape", function(req, res) {
	var news = "https://www.reuters.com/news/technology";
	// first, we grab the body of the html with request
	axios.get(news).then(function(response) {
		// then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		//  to avoid duplicates bc Reuters is stupid
		var resultArray = []; 

		// now, we grab every story container and do the following:
		$(".image-story-container_2baSf").each(function(i, element) {
			var result = {};

			// add the link text, href, and subheading text and save all as properties of result object
			result.title = $(this)
				.children("div")
				.children(".headline_ZR_Fh")
				.children("a")
				.text();
			result.link = $(this)
				.children("div")
				.children(".headline_ZR_Fh")
				.children("a")
				.attr("href");
			result.subhead = $(this)
				.children("div")
				.children(".lede_Wa-ek")
				.text();

			// to avoid duplicates bc Reuters is stupid
			if (resultArray.includes(result.link)) {
				return;
			}
			// push into array
			resultArray.push(result.link);

			// log test
			console.log(i, result.link);

			// create a new Article using the `result` object built from scraping
			db.Article.findOne({ link: result.link }, function(err, dbArticle) {
				if (err) {
					console.log(err);
					return;
				}

				if (!dbArticle) {

					console.log(i, "creatin", result.link);
					db.Article.create(result)
						.then(function(dbArticle) {
							// view the added result in the console
							//console.log(dbArticle);
						})
						.catch(function(err) {
							// if an error occurred, send it to the client
							console.log(err);
						});
				}
			});
		});

		// if we were able to successfully scrape and save an Article, send a message to the client
		res.send("Beep boop. Scrape complete!");
	});
});

// SERVER START
app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});
