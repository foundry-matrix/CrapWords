var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../lib/server.js");

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
		})
	});
});
