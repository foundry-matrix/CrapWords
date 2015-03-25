var model = require("./model.js");
var fs = require("fs");
var mandrillFunctions = require("./mandrill.js");


var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');
};

var keywordreport = function(request,reply){
    console.log('request handler for "/keywordreport"');
    console.log('request.payload.report: ', request.payload.report);
    console.log('request.payload.email: ', request.payload.email);
    model.save(request.payload.email, request);
}


var fetchdata = function(request, reply){
    console.log('request handler for "/fetchdata"');
    if (request.headers['x-requested-with'] === "XMLHttpRequest"){
        model.fetchData("asim.javed@mfyp.co.uk",function(data){
            reply(data[0].search.keywords);   
        });
    } else {
        reply("normal http request");
    }
};

var postEmail = function(request, reply){
    console.log('postEmail request handler triggered');
    model.save(request.payload.email, request);
    reply('email received and emailing customer their report');
};


var dynamicReport = function(request, reply){
    reply('dynamic working');   
};



module.exports = {
	home: home,
    postEmail: postEmail,
    dynamicReport: dynamicReport,
    fetchdata: fetchdata,
    keywordreport:keywordreport
};
