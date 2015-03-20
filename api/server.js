var Hapi = require('hapi');
var Joi = require('joi');
var Bell = require('bell');
var Cookie = require('hapi-auth-cookie');
var server = new Hapi.Server();
var model = require('../model.js');
var shortid = require('shortid');
var bcrypt = require('bcrypt');
var handler = require('../handler.js');
/* $lab:coverage:off$ */

var categoryArray = ['tech','apps','marketing'];

server.connection({
	host: "localhost",
	port: process.env.PORT || 8000
});
/* $lab:coverage:on$ */

    
server.register([require('bell'), require('hapi-auth-cookie')] , function(err){

    if (err){
        throw err;
    }

    server.auth.strategy('facebook', 'bell', {
        provider    : 'facebook',
        password    : 'cookie_encryption_password',
        clientId    : '1418107018212178',
        clientSecret: '530bbd388862ade7690c4c1066f5b7b7',
        isSecure    : false
    }); 

    server.auth.strategy('twitter','bell', {
        provider    : 'twitter',
        password    : 'cookie_encryption_password',
        clientId    : 'GPnZAsp4Evj2h78w1jza1sFNw',
        clientSecret: 'QoGYdKH8N82yNfKqRmJlnb8EzzyaBJ2bF8H2a67LQZgLM8uHEr',
        isSecure    : false
    });

    server.auth.strategy('session', 'cookie', {
        password        : 'password',
        cookie          : 'sid',
        reddirectTo     : '/',
        isSecure        : false
    });

    server.views({
        engines: {
            jade: require('jade')
        },
        path: "./views"
    });


//** AUTHENTICATION ROUTES **//

    server.route({
        method: ['GET','POST'],
        path: '/login',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.login,
            plugins: {
                'hapi-auth-cookie': {
                    reddirectTo: false
                }
            }
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/signup',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.signup,
            plugins: {
                'hapi-auth-cookie': {
                    reddirectTo: false
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.home,
        }
    });

    server.route({
        method: 'GET',
        path: '/profile',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.profile,
        }
    });


    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.logout,
        }
    });


    server.route({
        method  : ['GET', 'POST'],
        path    : '/facebook',
        config  : {
            auth: 'facebook',
            handler: handler.facebook,
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/twitter',
        config: {
            auth: 'twitter',
            handler: handler.twitter,
        }
    });




//** ROUTES **//
    server.route({					//CATEGORY
        method: 'GET',
        path: '/{category}',
        config: {
            handler: handler.viewcategoryblogs,
            validate: {
                params: {
                    category: Joi.string().valid(categoryArray)
                }
            }
        }
    });

    server.route({					//VIEWING A BLOGPOST
        method: 'GET',
        path: '/{category}/{id}',
        config: {
            handler: handler.viewsingleblog,
            validate: {
                params: {
                    id: Joi.number(),
                    category: Joi.string().valid(categoryArray)

                }
            }
        }
    });


    server.route({					//POSTING A BLOGPOST
        method: 'POST',
        config: { payload: {output: 'data', parse: true} },
        path: '/create',
        handler: handler.create
    });

    server.route({                   
        method: 'GET',
        path: '/create',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: handler.create,
        }
    });

});



//** RUNNING THE SERVER **//

server.start(function () {
    console.log('Server running at:', server.info.uri);
});



module.exports = server;
