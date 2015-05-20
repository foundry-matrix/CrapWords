	var words = [];
	var new_words;

$(document).ready(function(){
	
	var words = [];
	var new_words;
	
/*	$.get('/public/google_words.txt', function(data){
		words = data.split("\n");
		show(words);
	});*/

	$("#query_itunes").click(function(){
		myLoop(0,10000,100,20000,true);

	});	


	function myLoop(start,stop,steps,delay,isIpad){
		var loop_device;
		setTimeout( function(){
			if ( start < stop) {

				if (isIpad === true){
					loop_device = 'iPadSoftware';
				} else if (isIpad === false){
					loop_device = 'software';

				}
				var max = start + steps;
				for (i=start; i<max;i++){
					n_word = words[i].replace(/[^a-zA-Z, ]/g, "");
					var ajaxUrl ='http://local.host:8000/search/' + loop_device + '/' + n_word;
					
					$.ajax({ 
						url: ajaxUrl,
						dataType: 'json',
						success: function (response){
							var ranked = false;
							}
						});
				}
				myLoop(max,stop,steps,delay,isIpad);
			} else {
			}
		}, delay);
	}

});

	
	function show(str){
		str.forEach(function(word, index, array){
			new_word = word.replace(/[^a-zA-Z, ]/g, "");
			if (new_word.split(" ").length > 1){
			} else if (new_word.length > 15 || new_word.length === 0) {
			}
			else {
				words.push(new_word);
			}
			//console.log(new_word);
			if (index === (array.length - 30)){
			}
		});
	}



