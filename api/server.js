var Hapi    = require('hapi');
var Joi     = require('joi');
var server  = new Hapi.Server();
var handler = require('./handler.js');

server.connection({
    port: process.env.PORT || 8000,
	host: '0.0.0.0'
});


server.route([
    {
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    },{        
        method: 'GET',
        path: '/',
        handler: handler.home,
    },{        
        method: 'GET',
        path: '/fetchdata/{mongoId}',
        handler: handler.fetchdata,
    },{
        method: 'POST',
        path: '/postemail',
        config: {
            handler: handler.postEmail,
            payload: {output: 'data', parse: true}
        }
    },{
        method: 'GET',
        path: '/tests/{param*}',
        handler: {
            directory: {
                path: 'tests'
            }
        }
    },{          
        method: 'GET',
        path: '/search/{device}/{keywords}',
        handler: handler.keywordResults,
    },{
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
}]);

   
//** RUNNING THE SERVER **//
module.exports = server;
