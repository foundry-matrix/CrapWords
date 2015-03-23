var model = require('./model.js');
var html = '<html><head><style>h1{color: red}</style></head><body><h1>Hello World</h1><p>my paragraph</p></body></html>';
var pdf = require('html-pdf');
// var mandrill = require('mandrill-api/mandrill');
// var mandrill_client = new mandrill.Mandrill('HwSNMGOM1BPbwp5gr0QSuw');   //make this secret 
var mandrillFunctions = require('./mandrill.js');

var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');

	pdf.create(html, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
		if (err) return console.log(err);
		console.log("PDF Created");
	});
}

	// pdf.create(html, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
	// 	if (err) return console.log(err);
	// 	console.log("PDF Created");
	// });


}

var diagnosis = function (request, reply) {
    if (request.method === 'get') {
        console.log('request handler for "/diagnosis"');
        reply.file('views/index.html');
        pdf.create(html, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
            if (err) return console.log(err);
            console.log("PDF Created");
        });
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
