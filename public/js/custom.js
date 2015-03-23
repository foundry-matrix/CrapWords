$(document).ready(function(){
	var step0 = $("#step0");
	var step1 = $("#step1");
	var step2 = $("#step2");
 	var argument_div = $("#argument_div");
 	var auto_search = $("#auto_search");
 	
	$("#auto_search").autocomplete({
		source: function(request, response){

			// If user is searching for app by ID
			if ( isNaN(request.term) == false ){
				$.ajax({  
		          url: 'https://itunes.apple.com/lookup?id=' + request.term + '&country=us&entity=software&limit=10',
	              dataType: 'jsonp',
	              success: function( data ) {
	              	var i=0;	
	              	console.log(this.url);
	              	console.log("success");
	          		results =[];
	          		length = data.results.length;
	          		console.log('length is: ', length)
	          		for (i=0;i<length;i++){
	          		console.log('looping')
	          		results.push({"value": data.results[i].trackName, "id": data.results[i].trackId});
		          		if ( i==( length-1) ){
		            		console.log(' results: ',results);
		          			response(results);
		          		}
	          		}
		         
		         	}
				});
			// If user is searching for app by keywords
			}else{
				
				$.ajax({  
		          url: 'https://itunes.apple.com/search?term=' + request.term + '&country=us&entity=software&limit=10',
	              dataType: 'jsonp',
	              success: function( data ) {
	              	var i=0;	
	              	console.log(this.url);
	              	console.log("success");
	          		results =[];
	          		length = data.results.length;
	          		console.log('length is: ', length)
	          		for (i=0;i<length;i++){
	          		console.log('looping')
	          		results.push({"value": data.results[i].trackName, "id": data.results[i].trackId});
		          		if (i==( length-1) ){
		            		console.log(i,' results: ',results);
		          			response(results);
		          		}
	          		}
		         
		         	}
				});
			}
		},

		select: function( event, ui ) {
			 console.log('ui: ', ui);
			 console.log('ui.item: ', ui.item);
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
				auto_search.hide();
		}
	});
	}




// End of jQuery
});