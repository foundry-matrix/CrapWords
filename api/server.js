var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server();
var handler = require('../handler.js');

server.connection({
    port: process.env.PORT || 8000,
	host: '0.0.0.0'
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


//fetchdata
    server.route({          
        method: 'GET',
        path: '/fetchdata/{mongoId}',
        handler: handler.fetchdata,
    });

//Post form where user submits email address
/*
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
*/


// Ajax post for keyword report
server.route({                
    method: 'POST',
    path: '/postemail',
    config: { 
        handler: handler.postEmail,
        payload: {output: 'data', parse: true}
    }
});

server.route({
    method: 'GET',
    path: '/tests/{param*}',
    handler: {
        directory: {
            path: 'tests'
        }
    }
});


//
   server.route({          
        method: 'GET',
        path: '/search/{device}/{keywords}',
        handler: handler.keywordResults,
    });

// // Dynamic url depending on user's email - for their report
server.route({
    method: 'GET',
    path: '/{mongoId}',
    config: {
        handler: handler.dynamicReport,
        validate: {
            params: {
                mongoId : Joi.string().regex(/[0-9a-fA-F]{24}$/).length(24)
            }
        }
    }

});

    


   
//** RUNNING THE SERVER **//

// server.start(function () {
//     console.log('Server running at:', server.info.uri);
// });

module.exports = server;
