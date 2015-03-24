$(document).ready(function(){
	var appName, isValid;
	var allKeywords = [];
	var step0 = $("#step0");
	var step1 = $("#step1");
	var step2 = $("#step2");
	var diagnose_button = $("#diagnose_button");
 	var argument_div = $("#argument_div");
 	var auto_search = $("#auto_search");
 	var keyword_container = $("#keyword_container");
 	
	$("#auto_search").autocomplete({
		source: function(request, response){
			var searchUrl;			
			
			// If user is searching for app by ID
			if ( isNaN(request.term) == false ){
				searchUrl = 'https://itunes.apple.com/lookup?id=' + request.term + '&country=us&entity=software&limit=10';
			
			// If user is searching for app by keywords
			} else {
				searchUrl ='https://itunes.apple.com/search?term=' + request.term + '&country=us&entity=software&limit=10';
			}
				
			$.ajax({  
	          url: searchUrl,
              dataType: 'jsonp',
              success: function( data ) {
              	var i=0;	
              	console.log(this.url);
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
		     console.log("select clicked, fetching app with ID: ",ui.item.id);
		}
	});

	function fetchAppById(id){ 
		 $.ajax({
            url: 'https://itunes.apple.com/lookup?id=' + id,
            dataType: 'jsonp',
            success: function(response){				
				name = response.results[0].trackName;
				img_url = response.results[0].artworkUrl60	
				$("#app_icon").append("<img id='icon_img' src=" + img_url +">");
				$("#app_title").append(name);
				appName = name;
				step0.hide();
				step1.show();
		}
	});
	}

	$("#single_keyword_form").submit(function(e){
	    e.preventDefault();
		console.log("#keyword_form submitted");
	    var str = $("#single_keywords_input").val();
	    if ( !$("#single_keywords_input").val()) {
	    	str = "fun,race,free,bored,online,games,racing,playing,multiplayer,racing game,free games,fun games,fun racing";
	    }
	    cleanUpSingleKeywords(str, false);
	    fetchKeywordsFromTitle();
	   	renderStep2();
	});


	// Cleaning up the string of keywords (separating by commas and spaces plu removing non alphabetic characters and lowercasing all characters)
	function cleanUpSingleKeywords(str, fromTitle){
		var cleanSingleKeywords = [];
	    var keywords = str.replace(/[^a-zA-Z, ]/g, "").split(/[, ]/g);
	    for (var i=0, len=keywords.length; i < len; i++){
	    	if (keywords[i].length>0) {
	    		cleanSingleKeywords.push(keywords[i].toLowerCase());
	    	}
	    }
	    renderSingleKeywords(cleanSingleKeywords);
	    addToAllKeywords(cleanSingleKeywords, fromTitle, true);
	}

	// Add the single keywords to the allKeywords array
	function addToAllKeywords(keywords, fromTitle, singleKeyword){
		console.log('addToAllKeywords triggered');
		if (typeof(keywords) == Array){
			console.log('it an array');
			keywords.forEach(function (keyword){
				allKeywords.push({
						"keyword"         : keyword, 
						"title_keyword"   : fromTitle, 
						"single_keyword"  : singleKeyword });
				});
		} else if (typeof(keywords) == String){
				console.log('it a string');
				allKeywords.push({
						"keyword"         : keyword, 
						"title_keyword"   : fromTitle, 
						"single_keyword"  : singleKeyword });
		}
		renderKeywords(allKeywords);
	}

	// fetch keywords form app title
	function fetchKeywordsFromTitle(){
		cleanUpSingleKeywords(appName,true);
	}

	// render keywords
	function renderKeywords(keywords){
		console.log('renderKeywords triggered');
		keyword_container.innerHTML = "";
		var singleKeywordsHTML = [];
		for (var i=0,len=keywords.length;i<len;i++){
			singleKeywordsHTML.push('<li class="rendered_keyword">' + keywords[i].keyword + '</li>');
		}
		keyword_container.append(singleKeywordsHTML);
		console.log('allKeywords: ', allKeywords);
	}

	function renderStep2(){
		step1.hide();
		step2.show();
		diagnose_button.show();
	}

	$("#double_keyword_form").submit(function(e){
		e.preventDefault();
		var double_keywords_input = $("#double_keywords_input").val();
		console.log('double_keywords_input: ', double_keywords_input);
		var double_keywords = double_keywords_input.split(',');
		for (var i=0,len=double_keywords.length; i<len; i++){
			double_keywords[i].toLowerCase();
		}
		double_keywords.forEach(function(double_keyword){
			if (isDoubleKeyword(double_keyword) == true) {
				console.log('isDoubleKeyword is true, double_keyword is:', double_keyword);
				isValidDoubleKeyword(double_keyword);
			} else {
				console.log(double_keyword,' is not a double keyword');
			}
		});
	});

	//checking if the double keyword actually is a DOUBLE keyword
	function isDoubleKeyword(keyword){
		var arr = keyword.split(" ");
		if (arr.length > 1){
			return true;
		} else {
			return false;
		}
	}


	//checking if the double keyword actually is a combination of your single keywords
	function isValidDoubleKeyword(double_keyword){
		console.log('double_keyword is :', double_keyword);
		var arr = keyword.split(" ");
		arr.forEach(function(single_keyword,index,array){
			isValid = false;
			allKeywords.forEach(function(keywordObject){
				if (keywordObject.keyword === single_keyword){
					console.log('Match: ', keywordObject.keyword, '=', single_keyword);
					isValid = true;	
				}
			});
			if (index == (arr.length-1) ){
				if (isValid) {
					console.log(array.join(" "), 'does match properly, so its valid');
					addToAllKeywords(double_keyword,false,false);
				} else {
					console.log(array.join(" "), ' does not match properly, so it is not valid');
				}
			}
		});
		
	}




// End of jQuery
});