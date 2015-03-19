
var Hapi = require('hapi');
var Joi = require('joi');
var Bell = require('bell');
var Cookie = require('hapi-auth-cookie');
var server = new Hapi.Server();
var model = require('../model.js');
var shortid = require('shortid');
var bcrypt = require('bcrypt');
/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8000
});
/* $lab:coverage:on$ */


var nav_auth = '<nav><a href="/"> Home </a> <a href="/profile">Profile</a> <a href="/create"> Create </a> <a href="/logout"> Log out </a> </nav>';

var nav_unauth = ' <a href="/login">Login</a>  <a href="/signup"> Sign up </a> <a href="/twitter"> Twitter </a>  <a href="/facebook"> Facebook </a> ';

var categoryArray = ['tech','apps','marketing'];

var twitter = function(request,reply){
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


var facebook = function (request, reply) {
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


//** AUTHENTICATION **//

var logout = function(request,reply) {
    if (request.auth.isAuthenticated){
        console.log('is authenticated, so logging out!') 
        request.auth.session.clear();
        return reply.redirect('/');
    } else {
        console.log('is not authenticated, so just redirecting!') 
        return reply.redirect('/');
    }

}

var login = function(request,reply){
        
        console.log('request handler for "/login"');
        //console.log(request);
        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }

        if (request.method === 'get' || message) {
            return reply('<html><head><title>Login page</title></head><body>'
            + (message ? '<h3>' + message + '</h3><br/>' : '')
            + '<form method="post" action="/login">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Login"></form></body></html>');
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
                    
                    bcrypt.compare(request.payload.password, user.password, function(err, res){

                        console.log('user: ', user);
                        account = user;

                        if (!user){
                            message ='user doesnt exit';
                            console.log('user doesnt exit');
                            return reply.redirect('/');
                        }
                        


                        else if (res == false){
                            message = 'Invalid password';
                            console.log('user.password: ', user.password);
                            console.log('invalid passwod');
                            return reply.redirect('/');
                        }
                        
                        else if (res == true){
                            message = 'username and password MATCH!';
                            console.log('username and password MATCH!');
                            request.auth.session.set(account);
                            //request.response.header('test-header', 'test value')
                            return reply.redirect('/');
                        }
            });

            });                
        }
    }   
}

var signup = function(request,reply){
    if (request.method === 'get'){

       if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
        else{
            reply(nav_auth + '<form method="post" action="/signup">'
            + 'Username: <input type="text" name="username"><br>'
            + 'Password: <input type="password" name="password"><br/>'
            + '<input type="submit" value="Sign up"></form></body></html>');

        }

        
    }
 
    if (request.method === 'post'){


         bcrypt.genSalt(10, function(err,salt){
            console.log('Generating salt: ', salt);
            bcrypt.hash(request.payload.password,salt, function(err,hash){
                console.log('Generating hash: ', hash);
                model.db.usercollection.findOne({username: request.payload.username}, function(err,user){
                    if (err){
                        throw err;
                    }
                    if (user){
                        console.log('This user already exists');
                    }
                    else {
                        console.log('Creating new userr:');
                        var id = shortid.generate();
                        var new_user = new model.user(request.payload.username,'local',id,hash);
                        model.db.usercollection.save(new_user,function(err,user){
                            console.log('new user is ', user);
                            request.auth.session.set(user);
                            reply.redirect('/');
                        });
                    }
                });
            });
        });
    }
}

var home = function(request, reply){
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
                    reply(nav_auth + user.username);
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
        reply(nav_unauth);
    }
}



var profile = function(request,reply){

    console.log('request handler for "/profile"');
    console.log('REQUEST.AUTH: ', request.auth);

    if (request.auth.isAuthenticated){
        var t = request.auth.credentials;
        console.log('t.auth_id: ', t.auth_id);
        model.db.blogcollection.find({auth_id: t.auth_id}, function(err,blogposts){
            console.log('db query finished. Here is blogposts: ', blogposts);
            if (blogposts.length >0){
                var content = "";
                blogposts.forEach(function(post){
                    content +=  '<br><h3>' + post.title +  '</h3><br>' + post.text
                });
            reply(nav_auth + content);
            //reply(nav + content);
            } else{
                reply(nav_auth + 'You have not written any posts yet :( ')
            }
        });
    } else{
    reply.redirect('/login');

    }


}


var create = function(request, reply){
    
    console.log('request handler for "/create"');
    console.log('isAuthenticated: ', request.auth.isAuthenticated);
    console.log('REQUEST AT POST:');
    console.log(request);

    if (request.method === 'get'){
        if (request.auth.isAuthenticated){
            var t = request.auth.credentials;
                reply(nav_auth   + '<form method="post" action="/create">'
                            + '<h2>Write your blogpost</h2>'
                            + '<h3>Category</h3><input type="text" name="category",rows="2",cols="10">'
                            + '<h3>Title</h3><input type="text" name="title",rows="2",cols="10">'
                            + '<h3>Text</h3><textarea name="text" rows="10" cols="90"></textarea>'
                            + '<input type="submit", value="Save blog">'
                            + '</form>');
        }
        else {
            reply.redirect('/login');
        }
    }
    else if (request.method === 'post'){
        console.log('REQUEST.AUTH.CREDENTIALS AT POST :');
        console.log(request.auth.credentials);
        model.saveBlog(request.payload.title, request.payload.text, request.state.sid.username, request.payload.category, request.state.sid.auth_id);
        reply.redirect('/profile');
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


//** AUTHENTICATION ROUTES **//

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
            handler: home,
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
            handler: profile,
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
            handler: logout,
        }
    });


    server.route({
        method  : ['GET', 'POST'],
        path    : '/facebook',
        config  : {
            auth: 'facebook',
            handler: facebook,
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/twitter',
        config: {
            auth: 'twitter',
            handler: twitter,
        }
    });




//** ROUTES **//
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

    server.route({					//VIEWING A BLOGPOST
        method: 'GET',
        path: '/{category}/{id}',
        handler: function (request, reply) {
        	model.readBlog(function(fetchedBlog){
        		console.log('server says ----', fetchedBlog);
        		reply('Blog Post here, category: ' + request.params.category +  
            	', id: '+request.params.id + '<br>' 
            	+ 'Title:' +fetchedBlog[0].title + '<br>' 
            	+ 'Text:' + fetchedBlog[0].text + '<br><br>' + 'NOTE: 	At the moment the db fetches a hardcoded entry only. Later, it will fetch the right blogpost depending on the URL. See the Viewing a Blogpost function at line 256 of server.js for details'
            	);
        	});
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


    server.route({					//POSTING A BLOGPOST
        method: 'POST',
        config: { payload: {output: 'data', parse: true} },
        path: '/create',
        handler: create
    });

    server.route({                   
        method: 'GET',
        path: '/create',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: create,
        }
    });

});



//** RUNNING THE SERVER **//

server.start(function () {
    console.log('Server running at:', server.info.uri);
});



module.exports = server;
