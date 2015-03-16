var Hapi 	= require("hapi");
var server 	= new Hapi.Server();

server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});

server.route({
	path: "/",
	method: "GET",
	handler: function(request, reply) {
		reply("Hi m8");
	}
});

if (!module.parent) {
	server.start(function() {
		console.log("Server running at " + server.info.uri);
	});
}

module.exports = server;