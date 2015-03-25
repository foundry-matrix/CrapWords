var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata']);
var screenshot = require('./screenshot');
var oid = require("mongodb").ObjectID;

function user(email, searches){
	this.email = email;
	this.searches = searches;
}


function save(object, request){
	var searches = [];
	var search = {};
	search["keywords"] = object.report;
	search["date"] = Date.now();

	searches.push(search);
	
	var newUser = new user(object.email, searches);

	db.userdata.find({email: object.email}, function(err, data){
		if(data.length == 0){
			console.log("user does not exist. Creating new document");
			db.userdata.save(newUser, function(err, savedUser){
				if(err || !savedUser){
					console.log("ERROR not saved because of ", err);
				}
				fetchId(object.email, request);
			});
		} else {
			console.log("user exists. updating document");
			db.userdata.update({"email": object.email},
				{
					$push: {
					"searches": search
					}
				}
			);
			fetchId(object.email, request);
		}
	});
}

function fetchData(id, reply){
	db.userdata.find({_id: oid(id)}, function(err, allData){
		var recentsearch = allData[0].searches.length - 1;
		if(err || !allData){
			console.log("No data found");
		} else {
			console.log("successfully found document in db");
			reply(allData[0].searches[recentsearch].keywords); 
		}
	});
}

function fetchId(emailAddress, request){
	db.userdata.find( {email: emailAddress}, function(err, data){
		if(err || !data){
			console.log("No document found");
		} else {
			var mongoId = data[0]._id.toString();
			var mongoIdUrl = '/' + mongoId; 
			console.log('fetchID in model.js says mongourl is ----', mongoIdUrl);
			screenshot.takeScreenShot(mongoIdUrl, request);
		}
	});

}


module.exports = {
	save: save,
	fetchData: fetchData,
	fetchId: fetchId
};