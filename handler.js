var model = require('./model.js');
var bcrypt = require('bcrypt');
var shortid = require('shortid');
var categoryArray = ['tech','apps','marketing'];
var jade = require('jade');


var path = __dirname + '/views/index.jade';
var fn = jade.compileFile(path);

var fn2 = jade.compileFile(__dirname + '/views/index2.jade');
 
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
        if (request.auth.isAuthenticated) {
            reply.redirect('/');
        }

        if (request.method === 'get' || message) { 
            reply(fn({login_page: true}));
        }
        var message = '';
        var account = null;

        if (request.method === 'post'){
                    var password = request.payload.password;
        var username = request.payload.username;
            console.log('request.method is POST at LOGIN');

            if ( !username || !password){
                message = 'Missing username or password';
                reply(fn({login_page: true,
                message: message}));

            }

            else {

                model.db.usercollection.findOne({username: username}, function(err,user){
                    console.log('password: ', password);

                        console.log('user: ', user);
                        account = user;

                        if (!user){
                            message ='User doesnt exit';
                            console.log('user doesnt exit');
                            reply(fn({login_page: true,
                            message: message}));
                        }                        

                        bcrypt.compare(password, user.password, function(err, res){

                            if (res == false){
                                message = 'Invalid password';
                                console.log('user.password: ', user.password);
                                console.log('invalid passwod');
                                reply(fn({login_page: true,
                                            message: message}));
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
            reply(fn({signup_page: true}));

        }

        
    }
 
    if (request.method === 'post') {
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
                        message ='This user already exists';
                        reply(fn({signup_page: true,
                                message:message}));

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
                    model.db.blogcollection.find({auth_id: user.auth_id}, function(err,blogposts){ 
                        reply(fn2({ home_page: true,
                                    authenticated:true,
                                    blogposts:blogposts}));

                    });
                }
                else {
                    var new_user = new model.user(t.username,t.auth_method,t.auth_id);
                    model.db.usercollection.save(new_user,function(err,user){
                        reply(fn2({home_page:true,
                                   authenticated:request.auth.authenticated}));
                    });
                }

        });
    }
    else {
        reply(fn2({authenticated:request.auth.authenticated}));
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

            if (blogposts.length > 0){
                reply(fn({  profile_page: true,
                            authenticated: true,
                            blogposts:blogposts}));
            } else{
                reply( fn( { profile_page: true,
                             authenticated: true,
                             blogposts: blogposts } ));                //reply(nav_auth + 'You have not written any posts yet :( ')
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
                reply(fn({create_page: true,
                            authenticated: true}));
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


module.exports = {
	create:create,
	login:login,
	logout:logout,
	signup:signup,
	home:home,
	profile:profile,
	facebook:facebook,
	twitter:twitter
}

