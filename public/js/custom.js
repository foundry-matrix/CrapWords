$(document).ready(function(){
	
	var step0 = $("#step0");
	var step1 = $("#step1");
	var step2 = $("#step2");
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
		     fetchAppByName(ui.item.id);
		     console.log("select clicked, fetching app with ID: ",ui.item.id);
		}

	});



	function fetchAppByName(id){ 
		 $.ajax({
            url: 'https://itunes.apple.com/lookup?id=' + id,
            dataType: 'jsonp',
            success: function(response){				
				name = response.results[0].trackName;
				img_url = response.results[0].artworkUrl60	
				$("#app_icon").append("<img id='icon_img' src=" + img_url +">");
				$("#app_title").append(name);
				step0.hide();
				step1.show();
		}
	});
	}

	$("#single_keyword_form").submit(function(e){
	    e.preventDefault();

		console.log("#keyword_form submitted");

	    var str = $("#text").val();
	     if ( !$("#text").val()) {
	    	str = "fun,race,free,bored,online,games,racing,playing,multiplayer,racing game,free games,fun games,fun racing";
	    }
	    cleanUpKeywords(str);
	});

	function cleanUpKeywords(str){
		var singleKeywords = [];
	    var keywords = str.replace(/[^a-zA-Z, ]/g, "").split(/[, ]/g);

	    for (var i=0, len=keywords.length; i < len; i++){
	    	if (keywords[i].length>0) {
	    		singleKeywords.push(keywords[i]);
	    	}
	    }
	    renderSingleKeywords(singleKeywords);
	}

	function renderSingleKeywords(keywords){
		var singleKeywordsHTML = [];
		for (var i=0,len=keywords.length;i<len;i++){
			singleKeywordsHTML.push('<li class="rendered_keyword">' + keywords[i] + '</li>');
		}
		keyword_container.append(singleKeywordsHTML);
	}


// End of jQuery
});