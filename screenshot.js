var webshot = require('webshot');
var mandrillFunctions = require('./mandrill.js');

function takeScreenShot(mongoid, request){
    var options = {
        screenSize : {  width: 1024,
                        height: 768 },
        renderDelay: 10000,
        quality : 100
    };

    console.log('screenshot.js says dynamic URL is ---- /', mongoid);
    
    webshot('https://keywordking.herokuapp.com/' + mongoid, mongoid+'.pdf', options, function(err) {
        console.log("pdf created");
    	mandrillFunctions.sendEmail(request.payload.email, mongoid);
    });
}


module.exports = {
	takeScreenShot : takeScreenShot
};