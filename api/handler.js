var model               = require("./model.js");
var fs                  = require("fs");
var mandrillFunctions   = require("../mandrill.js");
var itunes              = require('itunes-search');

var home = function(request, reply){
    reply.file('views/index.html');
};


var fetchdata = function(request, reply){
    var mongoId = request.params.mongoId;
    if (request.headers['x-requested-with'] === "XMLHttpRequest"){
        model.fetchData(mongoId,function(data){
            reply(data);
        });
    } else {
        reply("normal http request");
    }
};

var postEmail = function(request, reply){
    model.save(request.payload, request);
    reply('email received and emailing customer their report');
};

var keywordResults = function(request,reply){
    var device = request.params.device;
    var keyword = request.params.keywords;

    // iPadSoftware is for iPad, and software is for iPhone
    if (device === 'iPadSoftware' || 'software') {
        model.fetchKeywordResultsFromDB(keyword, device, function(data, foundDocument, foundData){   
            if (foundData === true){
                reply(data);
            } else if (foundData === false) {
                fetchKeywordResultsFromItunes(keyword, device, function(data){
                    reply(data);
                });
            }
        });
    }
}

var fetchKeywordResultsFromItunes = function(keyword,device,reply){
    
    var options = {
        entity: device,
        country: 'us',
        limit: 50
    };

    itunes.search(keyword, options, function(response){
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
            trackId    : item.trackId
        }
        strippedList.push(strippedItem);
    });
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
