
var Hapi = require('hapi');
var Joi = require('joi');
var Bell = require('bell');
var Cookie = require('hapi-auth-cookie');
var server = new Hapi.Server();
var model = require('../model.js');

/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8000
});
/* $lab:coverage:on$ */


var nav = '<nav><a href="/">Home</a> <a href="/profile">Profile</a> <a href="/twitter">Twitter </a>  <a href="/facebook">Facebook login </a><a href="/logout">Log out </a> </nav>';


var categoryArray = ['tech','apps','marketing'];


var users = {
    per: {
        id: 'per',
        password: '123',
        fullName: 'Per Borgen'
    }
};

var login = function(request,reply){
        console.log('request handler for "/login"');
        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
        var message = '';
        var account = null;

        if (request.method === 'post'){
            console.log('request.method is POST');
            if ( !request.payload.username || !request.payload.password){
                message = 'Missing username or password';
            }
            else {
                console.log('searching for account: ', users[request.payload.username]);
                account = users[request.payload.username];
                
                if (!account || account.password !== request.payload.password){
                    message = 'Invalid username or password';
                }
            }
        }   

        if (request.method === 'get' || message) {
            return reply('<html><head><title>Login page</title></head><body>'
            + (message ? '<h3>' + message + '</h3><br/>' : '')
            + '<form method="post" action="/login">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Login"></form></body></html>');
        }

    request.auth.session.set(account);
    return reply.redirect('/');

}


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
        reddirectTo     : '/login',
        isSecure        : false
    });


    server.route({
        method: ['GET','POST'],
        path: '/login',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: login,
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
            handler: function(request, reply){
                console.log('request handler for "/"');
                // console.log('REQUEST.AUTH: ', request.auth);

                console.log('isAuthenticated: ', request.auth.isAuthenticated);
                if (request.auth.isAuthenticated){
                      var t = request.auth.credentials;
                    reply(nav + '<h1>Hello, ' + t.fullName + '</h1><p>Here\'s a nice picture of you I found:</p><img src="' + t.avatar + '"/>');
                }
                else {
                    reply(nav   + '<h1>Hello</h1><p>You should <a href="/login">log in</a>.</p>' 
                                + '<form method="post" action="/login">'
                                + 'Username: <input type="text" name="username"><br>'
                                + 'Password: <input type="password" name="password"><br/>'
                                + '<input type="submit" value="Login"></form><br>'
                                + '<form method="post">'
                                + '<h2>Write your blogpost</h2>'
                                + '<h3>Author</h3><input type="text" name="author",rows="2",cols="10">'
                                + '<h3>Title</h3><input type="text" name="title",rows="2",cols="10">'
                                + '<h3>Text</h3><textarea name="text" rows="10" cols="90"></textarea>'
                                + '<input type="submit", value="Save blog">'
                                + '</form>');
                }
            }
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
            handler: function(request,reply){
                console.log('request handler for "/profile"');

                console.log('REQUEST.AUTH: ', request.auth);
                var t = request.auth.credentials;
                reply('Hi ' + request.auth.credentials.fullName);
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'session',
            handler: function(request,reply) {
                request.auth.session.clear();
                return reply.redirect('/');
            }
        }
    });

    server.route({
        method  : ['GET', 'POST'],
        path    : '/facebook',
        config  : {
            auth: 'facebook',
            handler: function (request, reply) {
                console.log('request handler for "/facebook"');

                var t = request.auth.credentials;
                console.log('REQUEST.AUTH :', request.auth);
                var profile = {
                    hard_coded: 'hard coded facebook',
                    token       : t.token,
                    email       : t.profile.email,
                    //about     : t.profile.raw.description,
                    fullName    : t.profile.displayName 
                }
                console.log('raw ',t.profile.raw);
                request.auth.session.set(profile);
                return reply.redirect('/');     
            }
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/twitter',
        config: {
            auth: 'twitter',
            handler: function(request,reply){
                console.log('request handler for "/twitter"');
                var t = request.auth.credentials;
                console.log('REQUEST.AUTH :',request.auth);
                var profile = {
                    hard_coded  : 'hard coded twitter',
                    token       : t.token,
                    clientSecret: t.secret,
                    twitterId   : t.profile.username,
                    twitterName : t.profile.username,
                    avatar      : t.profile.raw.profile_image_url.replace('_normal', ''),
                    fullName    : t.profile.displayName             
                };
                console.log('profile: ', profile);
                request.auth.session.set(profile);
                return reply.redirect('/');             
            }
        }
    });







   /* server.route({					//HOMEPAGE
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('Hapi Blog');
        }
    });

*/

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
        	model.saveBlog(request.payload.title, request.payload.text, request.payload.author);
            reply('New Post Added. Your blog post is: ' + request.payload.text);

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


});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});


module.exports = server;
