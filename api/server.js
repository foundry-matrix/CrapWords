var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server();
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

//diagnosis
    server.route({          
        method: 'GET',
        path: '/diagnosis',
        handler: handler.diagnosis,
    });
//diagnosis
    server.route({          
        method: 'POST',
        path: '/diagnosis',
        handler: handler.diagnosis,
    });

//report
    server.route({          
        method: 'GET',
        path: '/report',
        handler: handler.report,
    });

//fetchdata
    server.route({          
        method: 'GET',
        path: '/fetchdata',
        handler: handler.fetchdata,
    });

//Post form where user submits email address
    server.route({                
    method: 'POST',
    path: '/',
    config: { 
        handler: handler.postEmail,
        payload: {output: 'data', parse: true},
        validate: {
            payload: {
                email: Joi.string().email()
            }
        } 
    }
});


   
//** RUNNING THE SERVER **//

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;
