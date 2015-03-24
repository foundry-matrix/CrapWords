var webshot = require('webshot');

function takeScreenShot(url, request){
    // if (request.method === 'get') {
    //     console.log('request handler for "/diagnosis"');
    //     reply.file('views/index.html');


        var options = {
            screenSize : {  width: 1024,
                            height: 768 },
            renderDelay: 5000,
            quality : 100
        }

        console.log('URL initially is ----', url);
        var url ='http://mbostock.github.io/d3/talk/20111116/bar-hierarchy.html';
        console.log('reassigned to be ', url);

        webshot(url,'report.pdf', options, function(err) {
            console.log("pdf created");
        });
    }
// }


module.exports = {
	takeScreenShot : takeScreenShot
}