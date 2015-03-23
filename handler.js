var model = require('./model.js');
var bcrypt = require('bcrypt');
var shortid = require('shortid');
var categoryArray = ['tech','apps','marketing','food'];
var jade = require('jade');


var path = __dirname + '/views/index.jade';
var fn = jade.compileFile(path);

var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');
}

module.exports = {
	home: home
}

