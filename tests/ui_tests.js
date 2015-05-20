$q(function() {   // fire event when iframe is ready
    $q('#applicationFrame').load(function() {
		$ = window.frames[0].jQuery;

		test('Correct title renders',function(){
			var logo = $('.title-logo')
			equal(logo.context.title, "Keyword King")
		});

		test('All steps besides step0 are hidden at launch',function(assert){
			
			assert.expect(6);

			var step1 = $("#step1");
			var step2 = $("#step2");
			var step3 = $("#step3");
			var step4 = $("#step4");
			var step5 = $("#step5");
			var step6 = $("#step6");

			equal(step1[0].style.display, '');
			equal(step2[0].style.display, '');
			equal(step3[0].style.display, '');
			equal(step4[0].style.display, '');
			equal(step5[0].style.display, '');
			equal(step6[0].style.display, '');

		});

		test('Step1 renders after step0 click', function(assert){
			var done = assert.async();
			$("#step0_button").trigger('click');	
			setTimeout(function(){
				var step1 = $("#step1");
				console.log('step1: ', step1);
				console.log('step1[0].style.display:', step1[0].style.display);
				equal(step1[0].style.display, 'block');
				done();
			},1000);
		});

		test('Step2 renders after step1 click', function(assert){
			var done = assert.async();
			$(".step1_button").trigger('click');	
			setTimeout(function(){
				var step2 = $("#step2");		
				equal(step2[0].style.display, 'block');
				done();
			},1000);
		});



	});

});
	