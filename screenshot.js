var webshot = require('webshot');
var mandrillFunctions = require('./mandrill.js');

function takeScreenShot(url, request){
    var options = {
        screenSize : {  width: 1024,
                        height: 768 },
        renderDelay: 10000,
        quality : 100
    };

    console.log('screenshot.js says dynamic URL is ----', url);
    
    webshot('http://localhost:8000' + url,'report.pdf', options, function(err) {
        console.log("pdf created");
    	mandrillFunctions.sendEmail(request.payload.email);
    });
}



module.exports = {
	takeScreenShot : takeScreenShot
};