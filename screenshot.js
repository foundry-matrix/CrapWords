var webshot = require('webshot');
var mandrillFunctions = require('./mandrill.js');
var host = require ('./host.js');

function takeScreenShot(mongoid, request){
    var options = {
        screenSize : {  width: 2000,
                        height: 3000 },
        renderDelay: 20000,
        quality : 100
    };

    console.log('screenshot.js says dynamic URL is ---- /', mongoid);
    var url = (host.domain + '/' + mongoid);
    console.log(url);
    webshot(url, 'reports/'+mongoid+'.pdf', options, function(err) {
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