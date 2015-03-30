	var words = [];
	var new_words;

$(document).ready(function(){
	console.log('google_words IPHONE: DONE');
	console.log('google_words IPAD: 0');

	console.log('list_of_nouns IPHONE: DONE')
	console.log('list_of_nouns IPAD: DONE')
	console.log('list_of_words IPAD: DONE')
	console.log('list_of_words IPHONE: DONE')
	console.log('jquery ready in load_file');
	var words = [];
	var new_words;
	$.get('/public/google_words.txt', function(data){
		words = data.split("\n");
		show(words);
	});

	$("#query_itunes").click(function(){
		console.log('query_itunes clicked');
		myLoop(0,10000,100,20000,true);

/*
		for (i=2000;i<2300;i++){
		console.log('word is :',  words[i]);
		n_word = words[i].replace(/[^a-zA-Z, ]/g, "");
		console.log('n_word is :',  n_word);
		var ajaxUrl ='http://local.host:8000/search/iPadSoftware/' + n_word;
		console.log('ajaxURL: ', ajaxUrl);
			$.ajax({ 
			url: ajaxUrl,
			dataType: 'json',
			success: function (response){
				var ranked = false;
				console.log('ajax success');					
				}
			});
		}
*/
	});	


	function myLoop(start,stop,steps,delay,isIpad){
		var loop_device;
		console.log('running myLoop. Start: ', start,' Stop: ', stop, ' Steps: ',steps, ' Delay: ',delay, 'isIpad is ', isIpad);
		setTimeout( function(){
			console.log('setTimeout function triggered in myLoop');
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
					console.log('ajaxURL: ', ajaxUrl);
					
					$.ajax({ 
						url: ajaxUrl,
						dataType: 'json',
						success: function (response){
							var ranked = false;
							console.log('ajax success');					
							}
						});
				}
				myLoop(max,stop,steps,delay,isIpad);
			} else {
				console.log('myLoop has reached stop number, so will not contine');
			}
		}, delay);
	}

});


	
	
	function show(str){
		str.forEach(function(word, index, array){
			new_word = word.replace(/[^a-zA-Z, ]/g, "");
			if (new_word.split(" ").length > 1){
				console.log(new_word + ' is double word')
			} else if (new_word.length > 15 || new_word.length === 0) {
				console.log(new_word + ' is too long or short')
			}
			else {
				words.push(new_word);
			}
			//console.log(new_word);
			if (index === (array.length - 30)){
				console.log('words is: ', words);
			}
		});
	}



