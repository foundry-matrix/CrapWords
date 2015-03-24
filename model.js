var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata']);
var screenshot = require('./screenshot'); 

function user(email){
	this.email = email;
	// this.search = search;
}

function save(email, request){
	// var search = {
	// 	app: app,
	// 	keywords: keywords,
	// 	date: Date.now()
	// }
	var newUser = new user(email);
	db.userdata.save(newUser, function(err, savedUser){
		if(err || !savedUser){
			console.log("not saved because of ", err);
		}
		fetchId(email, request);
	});
}

function fetchData(reply){
	db.userdata.find({}, function(err, allData){
		if(err || !allData){
			console.log("No data found");
		} else { 
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
}