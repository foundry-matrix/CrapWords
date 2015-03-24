var model = require("./model.js");
var fs = require("fs");
var mandrillFunctions = require("./mandrill.js");
var index = fs.readFileSync("views/index.html").toString();
//var pdf = require('html-pdf');
//var pdf = require('phantomjs-pdf');
var webshot = require('webshot');

var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');
}

var diagnosis = function (request, reply) {
    if (request.method === 'get') {
        console.log('request handler for "/diagnosis"');
        reply.file('views/index.html');


        var options = {
            screenSize : {  width: 1024,
                            height: 768 },
            renderDelay: 50,
            quality : 100
        }

        webshot('google.co.uk','report.pdf', options, function(err) {
            console.log("pdf created");
        });





        // var options = {
        //     "html" : index,
        //     "css" : "public/css/style.css",
        //     "js" : "public/js/custom.js",
        //     "deleteOnAction" : true
        // }


        // pdf.convert(options, function(result) {
        //     result.toFile("report.pdf", function() {
        //         console.log("pdf created");
        //     });
        // });
        
       
        // pdf.create(index, { filename: 'report.pdf', format: 'A4' }).toFile(function(err, res) {
        //     if (err) return console.log(err);
        //     console.log("PDF Created");
     
        // });


    }

    if (request.method === 'post') {
        var data = request.payload;
        console.log('request.method is POST. data is: ', data);
    }
}

var report = function(request, reply){
    console.log('request handler for "/report"');
    reply.file('views/report.html');
}

var fetchdata = function(request, reply){
    console.log('request handler for "/fetchdata"');
    if (request.headers['x-requested-with'] === "XMLHttpRequest"){
        model.fetchData("asim.javed@mfyp.co.uk",function(data){
            var newdata = JSON.stringify(data[0].search)
            console.log("fetch data call back");
            reply(newdata);//.redirect("/report");    
        });
    } else {
        reply("normal http request");
    }

}

var postEmail = function(request, reply){
    model.save(request.payload.email);
    mandrillFunctions.sendEmail(request.payload.email);
    reply('email received and emailing customer their report');
}

module.exports = {
	home: home,
    diagnosis: diagnosis,
    postEmail: postEmail,
    report: report,
    fetchdata: fetchdata
}
