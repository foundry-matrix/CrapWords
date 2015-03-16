var Hapi 	= require("hapi");
var server 	= new Hapi.Server();

server.connection({
	host: "localhost",
	// $lab:coverage:off$
	port: process.env.PORT || 8080
});

server.route({
	path: "/",
	method: "GET",
	handler: function(request, reply) {
		reply("Hi m8");
	}
});

module.exports = server;