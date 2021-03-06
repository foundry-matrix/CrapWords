
window.oncontextmenu = null;
var T = (function () {
	'use-strict';

	var appName, isValid, device;
	var allKeywords = [];
	var app_info = $("#app_info");
	var step0 = $("#step0");
	var step1 = $("#step1");
	var step2 = $("#step2");
	var step3 = $("#step3");
	var step4 = $("#step4");
	var step5 = $("#step5");
	var step6 = $("#step6");
	var spinner = $(".spinner");
	var joined_keyword_advices = "";
	var keyword_advices = [];
	var HTML = [];
	var pieData = [];
	var joinedHTML = "";
	var diagnose_button = $("#diagnose_button");
	diagnose_button.hide();
 	var argument_div = $("#argument_div");
 	var auto_search = $("#auto_search");
 	var keyword_container = $("#keyword_container");

	$("#auto_search").autocomplete({
		source: function(request, response){
			var searchUrl;		
			// If user is searching for app by ID
			if ( isNaN(request.term) == false ){
				searchUrl = 'https://itunes.apple.com/lookup?id=' + request.term + '&country=us&entity=' + device + '&limit=10';
			// If user is searching for app by keywords
			} else {
				searchUrl = 'https://itunes.apple.com/search?term=' + request.term + '&country=us&entity=' + device + '&limit=10';
			}
				
			$.ajax({  
	          url: searchUrl,
              dataType: 'jsonp',
              success: function( data ) {
              	var i=0;	
          		results =[];
          		length = data.results.length;
          		for (i=0;i<length;i++){
	          		results.push({"value": data.results[i].trackName, "id": data.results[i].trackId});
	          		if ( i==( length-1) ){
	          			response(results);
	          		}
          		}
	          }
			});
		},

		select: function( event, ui ) {
		     fetchAppById(ui.item.id);
		}
	});

	// go to itunes and fetch info about the chosen app and appen it to the site
	function fetchAppById(id){ 
		 $.ajax({
            url: 'https://itunes.apple.com/lookup?id=' + id,
            dataType: 'jsonp',
            success: function(response){
         		
            	//console.log(response);				
				name = response.results[0].trackName;
				img_url = response.results[0].artworkUrl60;
				appName = name;
				appId = response.results[0].trackId;

				app_info_html = "<div id='app_icon'><img id='icon_img' src=" + img_url + "></div><h3 id='app_title'>" + name + "</h3>"
				
				hideAndShow(step2,step3, function(){
					$(app_info_html).hide().appendTo(".app_info").fadeIn('fast');
				});
			}
	});
	}

	$("#modal-clicker-why-bother").on('click', function(){
	    $('#modal-why-bother').modal('show');
	});
	
	$("#modal-clicker-how-to-fetch").on('click', function(){
	    $('#modal-how-to-fetch').modal('show');
	});

	$("#modal-clicker-choose-device").on('click', function(){
	    $('#modal-choose-device').modal('show');
	});

	$("#modal-clicker-combinations").on('click', function(){
	    $('#modal-combinations').modal('show');
	});

	function hideAndShow(element1,element2,callback){
		element1.fadeOut('fast', function(){
			element2.fadeIn('fast');
			if (callback) callback();

		})
	}

	// SHOWING AND HIDING THE VARIOUS STEPS
	function show(jQueryElement){
		jQueryElement.fadeIn('fast');
	}

	function hide(jQueryElement){
		jQueryElement.fadeOut('fast');
	}

	$("#step0_button").on('click', function(){
		hideAndShow(step0,step1);
		hide($("#help_text"));
		hide($("#tagline"));
	});

	$(".step1_button").click(function(){
		device = this.name;
		//console.log('device: ',device);
		hideAndShow(step1,step2);
	});


	function renderStep4(){
		hideAndShow(step3,step4);
	}

	$("#single_keyword_form").submit(function(e){
	    e.preventDefault();
		//console.log("#single_keyword_form submitted");
	    var str = $("#single_keywords_input").val();
	    //console.log('single_keywords_input ', str);
	    if ( !$("#single_keywords_input").val()) {
	    	str = "free,bored,online,games,racing,playing,game,hello,test";
	    }
	    cleanUpSingleKeywords(str, false, addToAllKeywords);
	    fetchKeywordsFromTitle();
	   	renderStep4();
	
	});

	$("#diagnose_button").click(function(){
		hideAndShow(step4,spinner);		
		hide(diagnose_button);
		hide(keyword_container);
		setTimeout(function(){
			getKeywordResults(allKeywords);
		}, 500);
	});

	// Cleaning up the string of keywords (separating by commas and spaces plu removing non alphabetic characters and lowercasing all characters)
	function cleanUpSingleKeywords(str, fromTitle, callback){
		var cleanSingleKeywords = [];
	    var keywords = str.replace(/[^a-zA-Z, ]/g, "").split(/[, ]/g);
	    for (var i=0, len=keywords.length; i < len; i++){
	    	if (keywords[i].length>0) {
	    		cleanSingleKeywords.push(keywords[i].toLowerCase());
	    	}
	    }
	    callback(cleanSingleKeywords, fromTitle, true);
	}

	// Add the single keywords to the allKeywords array
	function addToAllKeywords(keywords, fromTitle, singleKeyword){
		if (keywords instanceof Array ){
			console.log('its an array');
			keywords.forEach(function (keyword){
				allKeywords.push({
						"keyword"           : keyword, 
						"title_keyword"     : fromTitle, 
						"single_keyword"    : singleKeyword,
						"combinations"      : [],
						"good_combinations" : false
					});
				});
		} else {
				console.log('its a string');
				allKeywords.push({
						"keyword"           : keywords, 
						"title_keyword"     : fromTitle, 
						"single_keyword"    : singleKeyword,
						"combinations"      : [],
						"good_combinations" : false
					});
		}
		renderKeywords(allKeywords);
	}

	// fetch keywords form app title
	function fetchKeywordsFromTitle(){
		cleanUpSingleKeywords(appName,true, addToAllKeywords);
	}

	// render keywords
	function renderKeywords(keywords){
		keyword_container.html("");
		var singleKeywordsHTML = [];
		for (var i=0,len=keywords.length;i<len;i++){
			singleKeywordsHTML.push('<li class="rendered_keyword">' + keywords[i].keyword + '</li>');
		}
		
		$('#keyword_container').append(singleKeywordsHTML);
		show(diagnose_button);
	}

	$("#double_keyword_form").submit(function(e){
		e.preventDefault();
		var double_keywords_input = $("#double_keywords_input").val();
		if ( !$("#double_keywords_input").val()) {
	    	double_keywords_input = "racing fun,online games,multiplayer games,racing game,fun run";
	    }

	    $("#double_keywords_input").val("");
		var double_keywords = double_keywords_input.split(',');
		for (var i=0,len=double_keywords.length; i<len; i++){
			double_keywords[i].toLowerCase();
		}
		double_keywords.forEach(function(double_keyword){
			if (isDoubleKeyword(double_keyword) == true) {
				isValidDoubleKeyword(double_keyword);
			} else {
				//console.log(double_keyword,' is not a double keyword');
				// add message to user: this keyword isnt a double keyword combination
			}
		});
	});

	//checking if the double keyword actually is a DOUBLE keyword
	function isDoubleKeyword(keyword){
		var arr = keyword.split(" ");
		if (arr.length > 1){
			return true;
		} else {
			alert(keyword + " is a single keyword and not a double keyword combination.");
			return false;
		}
	}


	//checking if the double keyword actually is a combination of your single keywords
	function isValidDoubleKeyword(double_keyword){
		var arr = double_keyword.split(" ");
		for (var i =0,len=arr.length; i<len;i++){ 
			isValid = false;
			for (var j=0,length=allKeywords.length; j<length;j++){
				if (allKeywords[j].keyword === arr[i]){
					isValid = true;
					break;
				}
			}
			if (!isValid){
				alert(arr[i] + "  is not included amongst your keywords. You can only create double keyword combinations from your existing keyword.")
				break;
			}
		}
		if (isValid){
			isUniqueDoubleKeyword(double_keyword);
		} else {
			// add a message to user "This keyword combo isnt valid!"
		}
	}

	// check if the double keyword exists already of if its unique
	function isUniqueDoubleKeyword(double_keyword){
		var isUnique = true;
		for (var i=0,length=allKeywords.length; i<length;i++){
				if (allKeywords[i].single_keyword == false) {
					if (allKeywords[i].keyword === double_keyword) {
						//console.log('This double keyword already exists: ', allKeywords[i].keyword, '=', double_keyword);
						isUnique = false;
						break;
					}
				}
			}
		if (isUnique){
			addToAllKeywords(double_keyword,false,false);
		}	else {
			// add message to user: "You have already added this keyword combination"
		}
	}

	function getKeywordResults(allKeywords){

		allKeywords.map(function(keywordObject, index, array){
			var length = array.length;
			runAjaxCall(keywordObject.keyword,index, length);
		});
	}

	var ajaxCalls = 0;

	function runAjaxCall(keyword, atIndex, length){
		var url = $(location).attr('href');
  		var urlsplit = url.split('/');
  		var urlDevice = device;
		var ajaxUrl ='http://'+urlsplit[2]+'/search/' + device + '/' + keyword;
		
		$.ajax({ 
			url: ajaxUrl,
			dataType: 'json',
			async:false,
			success: function (response){
				var ranked = false;
				console.log('ajax success');
				console.log('response: ', response);
				for (var j=0,len=response.length;j<len;j++) {
					if (response[j].trackId === appId) {
						allKeywords[atIndex]["rank"] = j+1;
						ranked = true;
						console.log("FOUND MATCH!, j+1 =", j+1, 'j=', j);

					}
					// if looped through all results without a match
					if (j === (len-1)){
						if (ranked === false){
							allKeywords[atIndex]["rank"] = 50;
						}
					}
				}
				ajaxCalls += 1;
				if (ajaxCalls === length){		
					insertKeywordCombinations(allKeywords);

				}


			}
		});
	}

	function insertKeywordCombinations(allKeywords){
		allKeywords.forEach(function (singleKeywordObject,index){
			if (singleKeywordObject.single_keyword === true){
				allKeywords.forEach(function (doubleKeywordObject){
					if (doubleKeywordObject.single_keyword === false){
						if (doubleKeywordObject.keyword.indexOf(singleKeywordObject.keyword) > -1){
							allKeywords[index].combinations.push(doubleKeywordObject);
						}
					}
				});
			}
		if (index === (allKeywords.length - 1)){
			addGoodCombosStamp(allKeywords);
		}
		});
	}


	function addGoodCombosStamp(allKeywords){
		allKeywords.forEach(function(keywordObject){ 
			var hasGoodCombo = false;
			if (keywordObject.combinations.length > 0){
				keywordObject.combinations.forEach(function(combosObject){
					if (combosObject.rank <= 15){
						hasGoodCombo = true;
					} 
				});
				if (hasGoodCombo === true){
					keywordObject["good_combinations"] = true;
				} 
			}
		});
		createKeywordArray(allKeywords);
		createPieArray(allKeywords);
	}


	function ajaxCall(successCallback){
		$.ajax({
			url: 'https://itunes.apple.com/search?term=jack+johnson',
			method: 'GET',
			dataType: 'jsonp',
			success: function(response){
				successCallback(response);
			}
		});
	}



	$("#email_input_button").click(function(){
		var email_address = $("#email_input_field").val();
		var url = $(location).attr('href');
  		var urlsplit = url.split('/');
		var ajaxUrl ='http://'+urlsplit[2]+'/postemail';
		$.ajax({
			url: ajaxUrl,
			method: "POST",
			data: {
				appName         : appName, 
				email           : email_address,
				report          : JSON.stringify(allKeywords),
				html            : joinedHTML,
				keywordAdvice   : joined_keyword_advices,
				pieData         : pieData
			},
			success: function(response){
				hideAndShow(step5,step6);	
			}
		})
	});


	function createKeywordArray(allKeywords){
		var keywordsArray = [];

		//create the array
		for (key in allKeywords){
			keywordsArray.push([allKeywords[key]['rank'],allKeywords[key]]);
		}

		//sort the array
		keywordsArray.sort(function(a, b) {
		    if (a[0] === b[0]) {
		        return 0;
		    }
		    else {
		        return (a[0] < b[0]) ? -1 : 1;
		    }
		});

		//console.log(keywordsArray);
		renderTable(keywordsArray);
	}

	function renderTable(keywordsArray){	
		HTML = [];
		HTML.push('<tr><th>Keyword</th><th>Your ranking</th><th>Feedback</th></tr>');
		keywordsArray.forEach(function(keywordObject){
			//console.log('keywordObject: ', keywordObject);
			if (keywordObject[1].rank >= 15){
				if (keywordObject[1].rank === 50){
					if (keywordObject[1].good_combinations === true){
						//console.log('50 rank, but has good combinations: ', keywordObject[1].keyword);
						HTML.push('<tr><td>' + keywordObject[1].keyword + '</td><td>>' + keywordObject[1].rank + "</td><td>Bad keyword. But it's a part of an important keyword combination.</td></tr>");
					} else {
						//console.log('50 rank, but does not have good combinations: ', keywordObject[1].keyword);
						HTML.push('<tr><td>' + keywordObject[1].keyword + '</td><td>>' + keywordObject[1].rank + '</td><td class="bad">Bad keyword. Swap it out!</td></tr>');
					}
				} else {
					if (keywordObject[1].good_combinations === true){
						HTML.push('<tr><td>' + keywordObject[1].keyword + '</td><td>' + keywordObject[1].rank + "</td><td>Bad keyword. But it's a part of an important keyword combination.</td></tr>");
					} else {
						HTML.push('<tr><td>' + keywordObject[1].keyword + '</td><td>' + keywordObject[1].rank + '</td><td class="bad">Bad keyword. Swap it out!</td></tr>');
					}
				}
			}
			else if (keywordObject[1].rank < 15) {
				HTML.push('<tr><td>' + keywordObject[1].keyword + '</td><td>' + keywordObject[1].rank + '</td><td class="good">Good keyword. Keep it!</td></tr>');
			}
		});

		joinedHTML = HTML.join("");

		hideAndShow(spinner,step5, function(){
			$("#rank_table").append(HTML);

		});

	}

	function createPieArray(allKeywords){
		var approved_keywords = [];
		var disapproved_keywords = [];
		allKeywords.forEach(function(keywordObject){
			if (keywordObject.rank >= 15 && keywordObject.single_keyword === true && keywordObject.good_combinations === false){
				disapproved_keywords.push(keywordObject.keyword);
			}
			else if (keywordObject.rank >= 15 && keywordObject.single_keyword === true && keywordObject.good_combinations === true){
				approved_keywords.push(keywordObject.keyword);
			}
			else if (keywordObject.rank < 15 && keywordObject.single_keyword === true){
				approved_keywords.push(keywordObject.keyword);
			}
		});
		
		createPieText(approved_keywords,disapproved_keywords);
	}

	function createPieText(approved_keywords,disapproved_keywords){
		var data = [approved_keywords.length, disapproved_keywords.length];
		var itunes_keywords_length = parseInt(data[0]) + parseInt(data[1]);
		var keyword_advices = [];
		keyword_advices.push('<h3 class="pie_title">Good Keywords</h3>');
		keyword_advices.push("<p class='pie_text'>" + parseInt(data[0]) + " of the " + itunes_keywords_length + " keywords you've added in iTunes are ranked well. </p>");
		approved_keywords.forEach(function(approved_word){
			keyword_advices.push('<li class="item">'+ approved_word +'</li>');
		});

		keyword_advices.push('<h3 class="pie_title">Bad Keywords</h3>');
		keyword_advices.push("<p class='pie_text'>" + parseInt(data[1]) + " of the " + itunes_keywords_length + " keywords you've added in iTunes are badly ranked. These are not likely to give your app any downloads and should be swapped out.</p>");
		disapproved_keywords.forEach(function(crapword){
			keyword_advices.push('<li class="item red">'+ crapword+'</li>');
		});

		keyword_advices.push('<h3 class="pie_title">Keyword Quality Ratio</h3>');
		keyword_advices.push("<p class='pie_text'>Below is a pie chart displaying you ratio between the good keywords and the bad ones.</p>");
		
		//console.log('keyword_advices: ', keyword_advices);
		joined_keyword_advices =keyword_advices.join("");
		$("#svg_div").append(joined_keyword_advices);
		pieData = [approved_keywords.length,disapproved_keywords.length]
		renderPie(pieData);
		
	}

	// PASTED IN FROM PREVIOUS PROJECT
	function renderPie(data){
		//console.log("render pie called!");
		var r =100;
		var color = d3.scale.ordinal()
					.range(["rgb(148, 210, 142)", "#D84343"]);

		var canvas = d3.select("#svg_div").append("svg")
								.attr("width", 200)
								.attr("height", 200)
								.attr("class", "svg");
		var arc = d3.svg.arc()
					.innerRadius(r-40)
					.outerRadius(r);

		var group = canvas.append("g")
						.attr("transform", "translate(100,100)");

		var pie = d3.layout.pie()
					.value(function(d){ return d;})

		var arcs = group.selectAll(".arc")
						.data(pie(data))
						.enter()
						.append("g")
						.attr("class","arc")
						

					arcs.append("path")
						.attr("d", arc)
						.attr("fill", function(d){ return color(d.data);})

		$("#svg_div").append('<h3 class="pie_title">Ok... Now what?</h3>');
		$("#svg_div").append("<ol id='instructions'><li id='pie_text'>Find new keywords you can replace the bad ones with.</li><li id='pie_text'>Update the app with the new keywords.</li><li id='pie_text'>Run this test again to check if the new keywords are approved.</li><li id='pie_text'>Repeat until all keywords are approved, and you'll see a significant increase in downloads.</li></ol>");	

}

	return{
		allKeywords:allKeywords,
		fetchAppById: fetchAppById,
		joined_keyword_advices:joined_keyword_advices,
		runAjaxCall:runAjaxCall,
		isDoubleKeyword:isDoubleKeyword,
		appName: appName,
		ajaxCall:ajaxCall,
		auto_search: auto_search,
		isValid:isValid,
		device:device,
		renderKeywords: renderKeywords,
		step1: step1,
		testVariable:testVariable,
		cleanUpSingleKeywords:cleanUpSingleKeywords
	}


})();
