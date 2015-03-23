var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata']);

function user(email, search){
	this.email = email;
	this.search = search;
}

function save(email, app, keywords){
	var search = {
		app: app,
		keywords: keywords,
		date: Date.now()
	}
	var newUser = new user(email, search);
	db.userdata.save(newUser, function(err, savedUser){
		if(err || !savedUser){
			console.log("not saved because of ", err);
		}
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

module.exports = {
	save: save,
	fetchData: fetchData
}