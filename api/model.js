var config 		= require('./config.js');
var db 			= require ('mongojs').connect(config.db.url, ['userdata','keywordresults']);
var screenshot 	= require('../screenshot');
var oid 		= require("mongodb").ObjectID;

function user(email, searches){
	this.email = email;
	this.searches = searches;
}

function keywordDocument(keyword,device,results){
	this.keyword = keyword;
	if (device === 'iPadSoftware'){
		this.iPadSoftware = results;
	} else if (device === 'software') {
		this.software = results;
	}
}


function saveKeywordResults(keyword,device,results){
	var newKeyword = new keywordDocument(keyword,device,results);
	var push = {};
	push[device] = results;
	db.keywordresults.update( { keyword : keyword },
							  { $set   : push },
							  { upsert  : true    }, 
							  function (err,savedResults) {
	
		if (err || !savedResults){
			throw err;
		}
		else{

		}
	});
}	

function save(object, request){
	var searches = [];
	var search = {};
	search["appName"] = object.appName;
	search["keywords"] = object.report;
	search["date"] = Date.now();
	search["html"] = object.html;
	search["keywordAdvice"] = object.keywordAdvice;
	search["pieData"] = object.pieData;

	searches.push(search);
	
	var newUser = new user(object.email, searches);

	db.userdata.find({email: object.email}, function(err, data){
		if(data.length == 0){
			db.userdata.save(newUser, function(err, savedUser){
				if(err || !savedUser){
					throw err;
				}
				fetchId(object.email, request);
			});
		} else {
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
			throw err;
		} else {
			reply(allData[0].searches[recentsearch]); 
		}
	});
}


function fetchKeywordResultsFromDB(keyword,device,callback){
	
	db.keywordresults.find({ keyword : keyword }, function(err,data){
		if (err){
			throw err;
		} 
		else if (data.length>0){
			if (device==='iPadSoftware'){
			 	if ( data[0].iPadSoftware !== undefined) {
					callback(data[0].iPadSoftware, true,true); 
				} 
				else if ( data[0].iPadSoftware === undefined) {
					callback('no data', true,false);
				}

			} 
			else if (device === 'software' ){

			 	if ( data[0].software !== undefined) {
					callback(data[0].software, true,true); 
				} 
				else if ( data[0].software === undefined) {
					callback('no data',true,false);
				}
			}
		}
		else {
			callback('no data',false, false);

		}
	});
}


function fetchId(emailAddress, request){
	db.userdata.find( {email: emailAddress}, function(err, data){
		if(err || !data){
		} else {
			var mongoId = data[0]._id.toString();
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