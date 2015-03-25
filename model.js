var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata']);
var screenshot = require('./screenshot'); 
var oid = require("mongodb").ObjectID;

function user(email, search){
	this.email = email;
	this.search = search;
}


function save(object, request){
	
	var newUser = new user(object.email, object.report);

	db.userdata.save(newUser, function(err, savedUser){
		if(err || !savedUser){
			console.log("ERROR not saved because of ", err);
		}
		fetchId(object.email, request);
	});
}

function fetchData(id, reply){
	db.userdata.find({_id: oid(id)}, function(err, allData){
		if(err || !allData){
			console.log("No data found");
		} else {
			console.log("successfully found document in db");
			reply(allData); 
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