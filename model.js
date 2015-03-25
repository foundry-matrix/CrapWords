var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata']);

function user(email, search){
	this.email = email;
	this.search = search;
}

function save(email){
	var search = {
		app: "fun run",
		keywords: [{keyword: "fun", rank:"5"},{keyword: "games", rank:"11"},{keyword: "racing", rank:"8"}],
		date: Date.now()
		}
	var newUser = new user(email, search);
	db.userdata.save(newUser, function(err, savedUser){
		if(err || !savedUser){
			console.log("not saved because of ", err);
		}
	});
}

function fetchData(id, reply){
	db.userdata.find({email: id}, function(err, allData){
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