var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('HwSNMGOM1BPbwp5gr0QSuw');
var fs = require("fs");

function sendEmail (emailAddress, mongoid) {
    var email = fs.readFileSync('views/email.html').toString();
    var report = fs.readFileSync(mongoid+".pdf");
    var base64str = Buffer(report).toString('base64'); 

    var message = {
        "html": email,
        "text": "This is your App report from Keyword King",
        "subject": "App Report from Keyword King",
        "from_email": "greg.aubert@yahoo.co.uk",
        "from_name": "Keyword King",
        "to": [{
                "email": emailAddress,
                "name": "Keyword King",
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
         "attachments": [{
                 "type": "application/pdf",
                 "name": "Keyword King App Report.pdf",
                 "content": base64str
             }],
        // "images": [{
        //         "type": "image/gif",
        //         "name": "fb.gif",
        //         "content": "ZXhhbXBsZSBmaWxl"
        //     }]
        };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = '';
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
        console.log('Email sent ----', result);
        fs.unlink(mongoid+".pdf", function (err) {
          if (err) throw err;
          console.log('successfully deleted report');
        });
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}


module.exports = {
    sendEmail: sendEmail
};