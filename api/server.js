
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


var nav = '<nav><a href="/">Home</a> <a href="/profile">Profile</a> <a href="/login">Login</a>  <a href="/signup">Sign up</a> <a href="/twitter"> Twitter </a>  <a href="/facebook"> Facebook </a> <a href="/logout"> Log out </a> </nav>';


var categoryArray = ['tech','apps','marketing'];


var login = function( request, reply){
        console.log('request handler for "/login", here is the reply object:');
        console.log(request);
        if (request.method === 'get' || message) {
            return reply('<html><head><title>Login page</title></head><body>'
            + (message ? '<h3>' + message + '</h3><br/>' : '')
            + '<form method="post" action="/login">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Login"></form></body></html>');
        }

        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
        var message = '';
        var account = null;

        if (request.method === 'post'){
            console.log('request.method is POST at LOGIN');
            if ( !request.payload.username || !request.payload.password){
                message = 'Missing username or password';
            }
            else {
                model.db.usercollection.findOne({username: request.payload.username}, function(err,user){
                console.log('user: ', user);
                account = user;
                console.log('request.payload.password: ', request.payload.password);

                if (!user){
                    message ='user doesnt exit';
                    console.log('user doesnt exit');
                    return reply.redirect('/');
                }
                
                else if (user.password !== request.payload.password){
                    message = 'Invalid password';
                    console.log('invalid passwod');
                    return reply.redirect('/');

                }
                
                else if (user.password === request.payload.password){
                    message = 'username and password MATCH!';
                    console.log('username and password MATCH!');
                    request.auth.session.set(account);
                    //request.response.header('test-header', 'test value')
                    return reply.redirect('/');
                }
            });                
        }
    }   
}

var signup = function(request,reply){
    if (request.method === 'get'){
        reply(nav + '<form method="post" action="/signup">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Sign up"></form></body></html>');
    }
    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }
    if (request.method === 'post'){
        model.db.usercollection.findOne({username: request.payload.username}, function(err,user){
            if (err){
                throw err;
            }
            if (user){
                console.log('This user already exists');
            }
            else {
                console.log('Creating new userr:');
                var id = Math.floor(Math.random() * 10000);
                var new_user = new model.user(request.payload.username,'local',id,request.payload.password);
                model.db.usercollection.save(new_user,function(err,user){
                    console.log('new user is ', user);
                    reply.redirect('/');
                });
            }
        });
    }

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
        reddirectTo     : '/',
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
        method: ['GET', 'POST'],
        path: '/signup',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: signup,
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
                console.log('REQUEST.AUTH: ', request.auth);
                console.log('isAuthenticated: ', request.auth.isAuthenticated);
                
                if (request.auth.isAuthenticated){
                    console.log('IS AUTHENTICATED: R.A.C:',request.auth.credentials)
                    var t = request.auth.credentials;   
                    console.log(t.username);

                    model.db.usercollection.findOne(
                        { query: 
                            {$and: 
                                [ {auth_id:t.auth_id},{auth_method: t.auth_method} ] } }, 
                        function(err,user){
                            if (user){
                                reply(nav + user.username);
                            }
                            else {
                                var new_user = new model.user(t.username,t.auth_method,t.auth_id);
                                model.db.usercollection.save(new_user,function(err,user){
                                    reply('hello ' +  user.username);
                                });
                            }

                    });
                }
                else {
                    reply(nav);
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
                reply('Hi ' + request.auth.credentials.username);
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
                console.log('REQUEST :');
                console.log(request);
                var profile = {
                    //token       : t.token,
                    username    : t.profile.displayName,
                    auth_method: 'facebook',
                    auth_id     : t.profile.raw.id,
                    email       : t.profile.email
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
                console.log('REQUEST :');
                console.log(request);
                var profile = {
                    //token           : t.token,
                    username        : t.profile.username,
                    auth_method     : 'twitter',
                    auth_id         : t.profile.id
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


});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});


module.exports = server;
