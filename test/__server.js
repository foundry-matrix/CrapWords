var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");
var handler = require('../handler.js');


// TEST 1
lab.experiment("A basic server test: ", function() {

 	var options = {
 		url: "/",
 		method: "GET"
 	};
 	lab.test("The home page ", function(done) {

 		server.inject(options, function(response) {
 			//console.log(response);
 			assert.equal(response.statusCode, 200, "should return a 200 status code");
 			assert.equal(typeof response.result, "string", "should reply with a string");
 			done();
 		});
 	});
 });

