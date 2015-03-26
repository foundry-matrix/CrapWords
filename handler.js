var model = require("./model.js");
var fs = require("fs");
var mandrillFunctions = require("./mandrill.js");
var itunes = require('itunes-search');


var home = function(request, reply){
    console.log('request handler for "/"');
    reply.file('views/index.html');
};


/*var keywordreport = function(request,reply){
    console.log('request handler for "/keywordreport"');
    console.log('request.payload.report: ', request.payload.report);
    console.log('request.payload.email: ', request.payload.email);
    model.save(request.payload.email, request);
}*/

var fetchdata = function(request, reply){
    console.log('request handler for "/fetchdata"');
    var mongoId = request.params.mongoId;
    if (request.headers['x-requested-with'] === "XMLHttpRequest"){
        model.fetchData(mongoId,function(data){
            reply(data[0].search);
        });
    } else {
        reply("normal http request");
    }
};

var postEmail = function(request, reply){
    console.log('postEmail request handler triggered');
    model.save(request.payload, request);
    reply('email received and emailing customer their report');
};

var keywordResults = function(request,reply){
    console.log('keywordResults handler triggered ');
    var device = request.params.device;
    var keyword = request.params.keywords;
    console.log('device: ', device);
    console.log('keyword: ', keyword);
    

    // iPadSoftware is for iPad, and software is for iPhone
    if (device === 'iPadSoftware' || 'software') {
        model.fetchKeywordResultsFromDB(keyword, device, function(data, foundDocument, foundData){   
            console.log('fetchKeywordResultsFromDB callback triggered');
            if (foundData === true){
                console.log('replying with data from the DB. Will not save!')
                reply(data);
            } else if (foundData === false) {
                console.log('No data in the database, so checking itunes');
                fetchKeywordResultsFromItunes(keyword, device, function(data){
                    reply(data);
                });
            }
        });
    }
}

var fetchKeywordResultsFromItunes = function(keyword,device,reply){
    console.log('querying itunes for results');
    
    var options = {
        entity: device,
        country: 'us',
        limit: 50
    };

    console.log('options: ',options);

    itunes.search(keyword, options, function(response){
        console.log('found itunes results, about to reply with the response');
        results = JSON.stringify(response.results);
        reply(results);
        stripAndSaveResults(response,keyword,device);
    });
}

function stripAndSaveResults(response,keyword,device){
    var strippedList = [];
    var list = response.results;
    list.forEach(function(item,index,array){
        strippedItem = {
            trackName  : item.trackName,
            trackId    : item.trackId
        }
        strippedList.push(strippedItem);
    });
    //console.log('strippedList: ', strippedList);
    model.saveKeywordResults(keyword,device,strippedList);
}



var dynamicReport = function(request, reply){
    reply.file('views/report.html'); 
};



module.exports = {
	home: home,
    postEmail: postEmail,
    dynamicReport: dynamicReport,
    fetchdata: fetchdata,
    keywordResults:keywordResults
};
