var model = require('./model.js');
var html = '<html><head><style>h1{color: red}</style></head><body><h1>Hello World</h1><p>my paragraph</p></body></html>';
var pdf = require('html-pdf');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('HwSNMGOM1BPbwp5gr0QSuw');   //make this secret 

var home = function(request, reply){
    console.log('request handler for "/"');
<<<<<<< HEAD
    reply.file('views/index.html');
}
=======

	pdf.create(html, { filename: './report.pdf', format: 'A4' }).toFile(function(err, res) {
		if (err) return console.log(err);
		console.log("PDF Created");
	});

    reply('Crapwords app');
}

>>>>>>> master


var sendEmail = function(request, reply){
    var message = {
    "html": "<p>Crapwords</p>",
    "text": "Example text content",
    "subject": "crapwords subject",
    "from_email": "greg.aubert@yahoo.co.uk",
    "from_name": "Greg",
    "to": [{
            "email": "gaj.aubert@gmail.com",
            "name": "Greg",
            "type": "to"
        }],
    "headers": {
        "Reply-To": "greg.aubert@yahoo.co.uk"
    },
    "important": null,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "bcc_address": "",
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "merge_language": "mailchimp",
    "global_merge_vars": [{
            "name": "merge1",
            "content": "merge1 content"
        }],
    "merge_vars": [{
            "rcpt": "recipient.email@example.com",
            "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
        }],
    "tags": [
        "password-resets"
    ],
    // "subaccount": "customer-123",
    "google_analytics_domains": [
        "example.com"
    ],
    "google_analytics_campaign": "message.from_email@example.com",
    "metadata": {
        "website": "www.example.com"
    },
    "recipient_metadata": [{
            "rcpt": "recipient.email@example.com",
            "values": {
                "user_id": 123456
            }
        }],
    // "attachments": [{
    //         "type": "text/plain",
    //         "name": "myfile.txt",
    //         "content": "ZXhhbXBsZSBmaWxl"
    //     }],
    // "images": [{
    //         "type": "image/png",
    //         "name": "IMAGECID",
    //         "content": "ZXhhbXBsZSBmaWxl"
    //     }]
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = ''
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
        console.log('Result is ---- ', result);
     
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
    reply('emailing customer');

}

module.exports = {
	home: home,
    sendEmail: sendEmail
}
