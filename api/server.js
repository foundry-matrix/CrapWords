var Hapi = require('hapi');
var Joi = require('joi');
// var Bell = require('bell');
// var Cookie = require('hapi-auth-cookie');
var server = new Hapi.Server();
var model = require('../model.js');
var shortid = require('shortid');
// var bcrypt = require('bcrypt');
var handler = require('../handler.js');

/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8000
});
/* $lab:coverage:on$ */

    



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
