var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server();
var model = require('../model.js');
var handler = require('../handler.js');

server.connection({
	host: "localhost",
	port: process.env.PORT || 8000
});


// Static files
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });

//Homepage
    server.route({          
        method: 'GET',
        path: '/',
        handler: handler.home,
    });

//Email
    server.route({          
        method: 'GET',
        path: '/email',
        handler: handler.sendEmail,
    });
   
//** RUNNING THE SERVER **//

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;