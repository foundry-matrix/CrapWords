
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server();
/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */


var categoryArray = ['tech','apps','marketing'];



server.route({					//HOMEPAGE
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hapi Blog');
    }
});


server.route({					//CATEGORY
    method: 'GET',
    path: '/{category}',
    handler: function (request, reply) {
        reply('Category section. The category is: ' + request.params.category);
    },
    config: {
        validate: {
            params: {
                category: Joi.string().valid(categoryArray)
            }
        }
    }
});


server.route({					//BLOGPOST
    method: 'GET',
    path: '/{category}/{id}',
    handler: function (request, reply) {
        reply('Blog Post here, category: ' + request.params.category +  
        	', id: '+request.params.id);
    },
    config: {
        validate: {
            params: {
                id: Joi.number(),
                category: Joi.string().valid(categoryArray)

            }
        }
    }
});



// payload output 'data' will read POST payload into memory. Can also be put in a file or made available as a stream
// payload parse 'true' is the default value, but worth knowing about. Uses the content-type header to parse the payload. set to false if you want the raw payload.
server.route({
    method: 'POST',
    config: { payload: {output: 'data', parse: true} },
    path: '/',
    handler: function (request, reply) {
        // code here to handle new post
        reply('New Post Added');
    }
});

// PUT has a payload too..
server.route({
    method: 'PUT',
    config: { payload: {output: 'data', parse: true} },
    path: '/{id}',
    handler: function (request, reply) {
        // code here to handle post update
        reply('Post '+request.params.id +' updated');
    }
});

server.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (request, reply) {
        // code here to delete post
        reply('Post '+request.params.id +' deleted');
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});


module.exports = server;
