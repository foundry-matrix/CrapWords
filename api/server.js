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

// // Dynamic url depending on user's email - for their report
// server.route({
//     method: 'GET',
//     path: dynamicUrl,
//     handler: handler.dynamicReport,    
// })




    


   
//** RUNNING THE SERVER **//

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;
