// REQUIRED PACKAGES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// SCRAPING TOOLS
// Axios is a promised-based HTTP library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// REQUIRE ALL MODELS
var db = require("./models");

// PORT, ADD ONE FOR HEROKU VERSION
var PORT = 3000;

// INITIALIZE EXPRESS
var app = express();

// CONFIGURE MIDDLEWARE
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// SERVER START
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

