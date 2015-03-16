var server = require("./api/server.js");

server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});


server.start(function() {
	console.log("Server running at " + server.info.uri);
});
