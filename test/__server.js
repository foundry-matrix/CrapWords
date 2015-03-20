var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");
var handler = require('../handler.js');



/*
lab.experiment("This trivial test: ", function() {

	lab.test("should hopefully pass", function(done) {
		assert.equal(1+2, 3, "(1+2 = 3)");
		done();
	});
});
*/


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


// TEST 2
lab.experiment("Login test:", function(){
	
	var options = {
		url: "/login",
		method: "POST",
		payload:{
			username: 'asim',
			password: '123'
		}
	}

	lab.test('When entered right password to /login,', function(done){
		server.inject(options, function(response){
 			assert.equal(response.statusCode, 302, " it should return a 302 status code because its redirecting");
 			done();
		});
	});
});


// TEST 3
lab.experiment("Login test:", function(){
	
	var options = {
		url: "/login",
		method: "POST",
		payload:{
			username: 'asim',
			password: '123_wrong_pass'
		}
	}

	lab.test('When entered wrong password to /login,', function(done){
		server.inject(options, function(response){
 			assert.equal(response.statusCode, 200, " it should return a 200 status code, as its not redirecting.");
 			done();
		});
	});
});


// TEST 4
lab.experiment("Login test:", function(){
	
	var options = {
		url: "/login",
		method: "POST",
		payload:{
			username: '',
			password: ''
		}
	}

	lab.test('When entered nothing to /login,', function(done){
		server.inject(options, function(response){
 			assert.equal(response.statusCode, 200, " it should return a 200 status code, as its not redirecting.");
 			done();
		});
	});
});


// TEST 5
lab.experiment("Signup test:", function(){
	
	var options = {
		url: "/signup",
		method: "POST",
		payload:{
			username: 'per',
			password: '11232132342434'
		}
	}

	lab.test('When entered a user which already exists,', function(done){
		server.inject(options, function(response){
 			assert.equal(response.statusCode, 200, " it should return a 200 status code, as its not redirecting.");
 			done();
		});
	});
});


// TEST 6
lab.experiment("Profile test:", function(){

	var options = {
		url: "/profile",
		method: "GET",
		credentials: {
			_id: '550aee73837cafce1c08d9c8',
		    username: 'per9',
		    auth_method: 'local',
		    auth_id: 'EJ4c6R7',
		    password: '$2a$10$YnxmoKC7bMcVt6uECUbJt.DG4ow3zrjfi3i94APIHDkq4lOuven/u'}
		}

	lab.test('When entering the profile page as a logged in user,', function(done){
		server.inject(options, function(response){
			console.log('RESPONSE OBJECT: ', response);
			console.log('YO response.raw: ', response.raw.res);
 			assert.equal(response.statusCode, 200, " it should return 200.");
			done();
		});
	});

});








// lab.experiment("Checking the posts", function() {

// 	var options = {
// 		url: "/posts",
// 		method: "GET"
// 	};

// 	lab.test("Return an array of objects", function(done) {

// 		server.inject(options, function(response) {
// 			assert.equal(response.statusCode, 200, "it should return a 200 status code");
// 			assert.equal(response.result instanceof Array, true, "it should reply with an array");
// 			assert.equal(typeof response.result[0].author, "string", "author should be a string");
// 			assert.equal(typeof response.result[0].contents, "string", "contents should be a string");
// 			done();
// 		});
// 	});
// });


// lab.experiment("Making a post", function() {

// 	var options = {
// 		url: "/posts",
// 		method: "POST",
// 		payload: {
// 			author: "thezurgx",
// 			title: "Anakin goes clubbing again",
// 			content: "blahblahblah"
// 		}
// 	};

// 	lab.test("with valid fields", function(done) {

// 		server.inject(options, function(response) {
// 			assert.equal(response.statusCode, 201, "should return a 201 CREATED status code");
// 			assert.deepEqual(response.result, options.payload, "should reply with the created post's content");
// 			done();
// 		});
// 	});
// });


// lab.experiment("Error for the trolls", function() {

// 	var options = {
// 		url: "/nevergonnagiveyouup",
// 		method: "GET"
// 	};

// 	lab.test("Return a sexy 404 status code", function(done) {

// 		server.inject(options, function(response) {
// 			assert.equal(response.statusCode, 404, "it should return da 404");
// 			done();
// 		});
// 	});
// });




// lab.experiment("User authentication", function() {

// 	lab.test("Registering a valid user", function(done) {

// 	    var options = {
// 	        method: "PUT",
// 	        url: "/users/testuser",
// 	        payload: {
// 	            full_name: "Test User",
// 	            age: 33,
// 	            image: "dhown783hhdwinx.png",
// 	            password: "p455w0rd"
// 	        }
// 	    };

// 	    server.inject(options, function(response) {

// 	        var result = response.result,
// 	        payload = options.payload;

// 	        assert.equal(response.statusCode, 201);
// 	        assert.equal(result.full_name, payload.full_name);
// 	        assert.equal(result.age, payload.age);
// 	        assert.equal(result.image, payload.image);
// 	        assert.equal(result.count, 0);

// 	        done();
// 	    });
// 	});

// 	lab.test("A failed login attempt", function(done) {

// 		var badlogin = {
// 			url: "/login",
// 			method: "POST",
// 			headers: { "Content-Type" : "application/x-www-form-urlencoded" },
// 			payload: "username=zurfyx&pass=password"
// 		};

// 		server.inject(badlogin, function(response) {
// 			assert.equal(response.statusCode, 401, "should return a 401 status code");
// 			assert.equal(response.result.message, "Invalid username or password", "should return an error message");
// 			assert.equal(response.cookie, undefined, "should not give us a cookie");
// 			done();
// 		});
// 	});

// 	lab.test("Successful login", function(done) {

// 		var goodlogin = {
// 			url: "/login",
// 			method: "POST",
// 			headers: { "Content-Type" : "application/x-www-form-urlencoded" },
// 			payload: "username=thezurgx&pass=l337_p@s5w0rD?"
// 		};

// 		server.inject(goodlogin, function(response) {
// 			assert.equal(response.statusCode, 200, "it should return a 200 status code");
// 			assert.notEqual(response.cookie, undefined, "it should return a good cookie");
// 			done();
// 		});
// 	});
// });