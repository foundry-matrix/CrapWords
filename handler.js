var model = require('./model.js');
var html = '<html><head><style>h1{color: red}</style></head><body><h1>Hello World</h1><p>my paragraph</p></body></html>';
var pdf = require('html-pdf');

var home = function(request, reply){
    console.log('request handler for "/"');

	pdf.create(html, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
		if (err) return console.log(err);
		console.log(res);
	});

    reply('Crapwords app');
}
 


module.exports = {
	home: home
}

