var model = require("./model.js");
var fs = require("fs");
var mandrillFunctions = require("./mandrill.js");
var index = fs.readFileSync("views/index.html").toString();
//var pdf = require('html-pdf');
var pdf = require('phantomjs-pdf');

var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');
}

var diagnosis = function (request, reply) {
    if (request.method === 'get') {
        console.log('request handler for "/diagnosis"');
        reply.file('views/index.html');


        var options = {
            "html" : index,
            "css" : "public/css/style.css",
            "js" : "public/js/custom.js",
            "deleteOnAction" : true
        }


        pdf.convert(options, function(result) {
            result.toFile("report2.pdf", function() {
                console.log("pdf created");
            });
        });
        
       
        // pdf.create(index, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
        //     if (err) return console.log(err);
        //     console.log("PDF Created");
     
        // });


    }

    if (request.method === 'post') {
        var data = request.payload;
        console.log('request.method is POST. data is: ', data);
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
    postEmail: postEmail
}
