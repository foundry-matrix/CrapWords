var webshot = require('webshot');
var mandrillFunctions = require('./mandrill.js');
var host = require ('./host.js');

function takeScreenShot(mongoid, request){
    var options = {
        screenSize : {  width: 1024,
                        height: 768 },
        renderDelay: 20000,
        quality : 100
    };

    console.log('screenshot.js says dynamic URL is ---- /', mongoid);
    var url = (host.domain + '/' + mongoid);
   // var url = "www.amazon.co.uk";
    console.log(url);
    webshot(url, mongoid+'.pdf', options, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("pdf created");
    	mandrillFunctions.sendEmail(request.payload.email, mongoid);
    });
}

module.exports = {
	takeScreenShot : takeScreenShot
};