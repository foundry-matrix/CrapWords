var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");
var handler = require('../handler.js');




//EMPTY TESTS

lab.experiment("When the user clicks the SUBMIT button", function() {

	lab.test("if new, the user's email and search data object is saved to db", function(done) {

	});


	lab.test("if existing, a search object is appended to the document in the db", function(done) {

	});


	lab.test("the user's mongoDB ID is extracted from the db", function(done) {

	});


	lab.test("a unique URL based taking the form: '/' + ID  is stored as a var ", function(done) {

	});


	lab.test("the Webshot module is invoked and pointed to the unique URL", function(done) {

	});


	lab.test("routing logic handles the http request for the unique URL and serves correct html, css and js file", function(done) {

	});


	lab.test("the JS file immediately invokes an AJAX request for data from the db based on the user's ID", function(done) {

	});


	lab.test("the screenshot is set as an attachement and Mandrill sends an email to the user", function(done) {

	});

	
});

