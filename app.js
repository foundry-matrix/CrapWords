var server = require("./api/server.js");

/* $lab:coverage:off$ */
if (!module.parent) {
	server.start(function() {
		console.log("Server running at " + server.info.uri);
	});
}
/* $lab:coverage:on$ */