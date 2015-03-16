var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");
//____________________Custom line break_______________________//

lab.experiment("This trivial test: ", function() {

	lab.test("should hopefully pass", function(done) {
		assert.equal(1+2, 3, "(1+2 = 3)");
		done();
	});
});


lab.experiment("A basic server test: ", function() {

	var options = {
		url: "/",
		method: "GET"
	};

	lab.test("The home page ", function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.equal(typeof response.result, "string", "should reply with a string");
			done();
		});
	});
});


lab.experiment("Checking the posts", function() {
	
	var options = {
		url: "/posts",
		method: "GET"
	};

	lab.test("Return an array of objects", function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "it should return a 200 status code");
			assert.equal(response.result instanceof Array, true, "it should reply with an array");
			assert.equal(typeof response.result[0].author, "string", "author should be a string");
			assert.equal(typeof response.result[0].contents, "string", "contents should be a string");
			done();
		});
	});
});


lab.experiment("Making a post", function() {
	
	var options = {
		url: "/posts",
		method: "POST",
		payload: {author: ""}
	};

	lab.test("Return an array of objects", function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "it should return a 200 status code");
			assert.equal(response.result instanceof Array, true, "it should reply with an array");
			assert.equal(typeof response.result[0].author, "string", "author should be a string");
			assert.equal(typeof response.result[0].contents, "string", "contents should be a string");
			done();
		});
	});
});


lab.experiment("Error for the trolls", function() {
	
	var options = {
		url: "/nevergonnagiveyouup",
		method: "GET"
	};

	lab.test("Return a sexy 404 status code", function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 404, "it should return da 404");
			done();
		});
	});
});


lab.experiment("User authentication", function() {
	
	var badlogin = {
		url: "/login",
		method: "POST",
		headers: { "Content-Type" : "application/x-www-form-urlencoded" },
		payload: "username=zurfyx&pass=password"
	};

	var goodlogin = {
		url: "/login",
		method: "POST",
		headers: { "Content-Type" : "application/x-www-form-urlencoded" },
		payload: "username=thezurgx&pass=l337_p@s5w0rD?"
	};

	lab.test("Failed login", function(done) {

		server.inject(badlogin, function(response) {
			assert.equal(response.statusCode, 401, "it should return a 401 status code");
			done();
		});
	});

	lab.test("Successful login", function(done) {

		server.inject(badlogin, function(response) {
			assert.equal(response.statusCode, 200, "it should return a 200 status code");
			assert.notEqual(response.cookie, undefined, "it should return a good cookie");
			done();
		});
	});
});