
var db = require ('mongojs').connect('mongodb://crapwords:crapwords@ds039281.mongolab.com:39281/crapwords', ['userdata','keywordresults']);

var screenshot = require('./screenshot');
var oid = require("mongodb").ObjectID;

function user(email, searches){
	this.email = email;
	this.searches = searches;
}

function keywordDocument(keyword,device,results){
	console.log('Creating keywordDocument for DB');
	this.keyword = keyword;
	if (device === 'iPadSoftware'){
		this.iPadSoftware = results;
	} else if (device === 'software') {
		this.software = results;
	}
	//this.device = device;
}


function saveKeywordResults(keyword,device,results){
	console.log('saveKeywordResults triggered');	
	
	var newKeyword = new keywordDocument(keyword,device,results);

	var push = {};
	push[device] = results;
	console.log('push: ', push);
	console.log('newKeyword: ', newKeyword);
	db.keywordresults.update( { keyword : keyword },
							  { $set   : push },
							  { upsert  : true    }, 
							  function (err,savedResults) {
	
		if (err || !savedResults){
			console.log("ERROR not saved because of ", err);
		}
		else{
			console.log('SAVED: ',savedResults);
			//console.log('succes: ',savedResults);
		}
	})

/*
	db.keywordresults.save(newKeyword, function(err,savedResults){
		if (err || !savedResults){
			console.log("ERROR not saved because of ", err);
		}
		else{
			console.log('SAVED!');
			//console.log('succes: ',savedResults);
		}
	})

*/

}	
function save(object, request){
	var searches = [];
	var search = {};
	search["appName"] = object.appName;
	search["keywords"] = object.report;
	search["date"] = Date.now();
	search["html"] = object.html;

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
			reply(allData[0].searches[recentsearch]); 
		}
	});
}


function fetchKeywordResultsFromDB(keyword,device,callback){
	console.log('fetchKeywordResultsFromDB triggered');
	
	db.keywordresults.find({ keyword : keyword }, function(err,data){
		console.log('looking for keywordresults in DB.');
		if (err){
			console.log('err ',err);
		} 
		else if (data.length>0){
			console.log('data exists in DB')

			if (device==='iPadSoftware'){

				console.log('device is iPadSoftware. Here is data:');
				console.log(data[0].iPadSoftware);
			 	
			 	if ( data[0].iPadSoftware !== undefined) {
			 		console.log('data[0].iPadSoftware exists in DB');
					callback(data[0].iPadSoftware, true,true); 
				} 
				else if ( data[0].iPadSoftware === undefined) {
					console.log('data object, but iPadSoftware is undefined!');
					callback('no data', true,false);
				}

			} 
			else if (device === 'software' ){

				console.log('device is software. Here is data:');
				console.log(data[0].software);
			 	
			 	if ( data[0].software !== undefined) {
			 		console.log('data[0].software exists in DB');
					callback(data[0].software, true,true); 
				} 
				else if ( data[0].software === undefined) {
					console.log('data object, but software is undefined!');
					callback('no data',true,false);
				}
			}
		}
		else {
			console.log('data.length <= 0. No data!');
			callback('no data',false, false);

		}
	});
}


function fetchId(emailAddress, request){
	db.userdata.find( {email: emailAddress}, function(err, data){
		if(err || !data){
			console.log("No document found");
		} else {
			var mongoId = data[0]._id.toString();
			console.log('fetchID in model.js says mongourl is ---- /', mongoId);
			screenshot.takeScreenShot(mongoId, request);
		}
	});

}


module.exports = {
	save: save,
	fetchData: fetchData,
	fetchId: fetchId,
	fetchKeywordResultsFromDB:fetchKeywordResultsFromDB,
	saveKeywordResults:saveKeywordResults
};