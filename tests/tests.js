test("Length of allKeywords array is 0 initially", function(){
	equal(T.allKeywords.length, 0);
});

test("initial variables does not have values", function(){
	notOk(T.appName);
	notOk(T.isValid);
	notOk(T.device);	
});

test('joined_keyword_advices is empty initially', function(){
	equal(T.joined_keyword_advices, "");
})

test('isDoubleKeyword returns correctly', function(){
	equal(T.isDoubleKeyword('fun run'), true);
	equal(T.isDoubleKeyword('games toy'), true);
	equal(T.isDoubleKeyword('23 candy'), true);
});

test('iTunes API replies with an object', function(assert){
	done = assert.async();

	T.ajaxCall(function successCallback(response){
		console.log('Ajax finished in tests.js. Response:', response);
		var responseType = typeof(response);
		equal(responseType, 'object');
		done();
	});

});


/*		test('cleanSingleKeywords works', function(){
			var dirty = ['fun!','run!'];
			var clean = ['fun','run']; 

			function cleanCheck(cleanSingleKeywords, arg2, arg3){
				if (cleanSingleKeywords === clean) {
					return true;
				} else {
					return false;
				}
			}

			T.cleanSingleKeywords(dirty,true,cleanCheck);

			equal();

		});*/


/*	});

});
	*/	/*test("callAjax", function(assert){
			var done = assert.async();
			T.callAjax(function successCallback(response){
				assert.equal(response, 'expected ajax response')
				done();
			});
		})
		*/
