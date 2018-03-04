$(document).ready(function () {
	$.ytLoad();
	/*$('.submit').click(function(){
		$('#ajaxContent').load('ajax.html');
	});*/
	var timer
	var brain_data = []
	submitAnswer();
	var question_number = 1;
	$(window).load(function(){
		$("#loader").fadeOut("slow");
	});
	function showSolved() {
		$('.solved').innerHTML = ""
		console.log('solved');
		
		brain_data.map(data => {
			$('.solved').append('<div>soloved</div>')
		})
	}
	function submitAnswer() {
		timer = setInterval(function(){
			var date = new Date();
			console.log(date.getTime() >= 1520269752643);
			if(date.getTime() >= 1520269752643) {
				console.log('sending ...')
				check_answer_automatically(brain_data);
				// clearInterval(timer);
			}
		}, 100000000)
	}
	showSolved()
	$(".main question").first().addClass('active');
	if($('.main question').first().hasClass('active')){
		$("#back").hide();
	}
	$(".question_number").html('');
	$(".question_number").html('Question '+ question_number);
	/*setInterval(function(){
		var data = {
			question_id: $('.active #id').val(),
			answer: 'null'
		}
		check_answer(data);
	},2000);*/
	$('#myModal').modal();
	$("#leaderboard").click(function(){
		$.ajax({
			method: 'GET',
			url: '/leaderboard',
			contentType: 'application/json'
		})
		.done(function(response) {
			$('.leaderboard .name,.leaderboard .score').html('');
			for(i=0;i<response.length;i++){
				$(".leaderboard .name").append(response[i].username);
				$(".leaderboard .score").append(response[i].score);	
			}
		});
	});
	// checkAnswers(brain_data);
	$('.next').on('click', function(){
		let activeElement = $('.active');
		if(activeElement.next('question:last').length){
			
			activeElement.removeClass('active').next().addClass('active');
			question_number++;
			$(".question_number").html('');
			$(".question_number").html('Question '+ question_number);
		}
	})
	$('.logout').on('click', function(){
		window.location = '/logout'
	})
	$('.submit').on('click',function() {
		var question_id = $('.active #id').val();
		var radio = $(".active input:radio[name=answer]:checked");
		$(this).removeClass('submit');
		$('#form-messages').html('');
		var data = {
			question_id: $('.active #id').val(),
			answer:  radio.val(),
			class: radio.attr('class') 
		};
		// if(!radio.val()) {
		// 	$('.msg').innerHTML = "No Answer selected, please use NEXT to go to the next question!"
		// 	return;
		// }
		radio.prop('checked', false);
		/*console.log(data.answer);*/
		// brain_data.push(data);
		
		var obj = $.grep(brain_data, function(obj){return obj.question_id === question_id;})[0];
		if(obj && data.answer) {
			let i = brain_data.indexOf(obj);
			brain_data[i] = data;
		} else if(data.answer) {
			brain_data.push(data);
		}
		var activeElement = $('.active');
		if(activeElement.next().length){
			activeElement.removeClass('active').next().addClass('active');
			question_number++;
			$(".question_number").html('');
			$(".question_number").html('Question '+ question_number);
		}
		else{
			// if($(".main > question:last").hasClass('active')){
			// 	check_answer(brain_data);
			// 	window.location.reload();
			// }
			activeElement.removeClass('active').closest('.main').find('> question:last').addClass('active');
		}
		checkAnswers(brain_data);
		/*if(!data.answer){
			$('#form-messages').html('');
			$('#form-messages').append("Empty answer not accepted");
		}else{
			check_answer(data);
		}*/
	});
  // window.onbeforeunload = confirmExit;
  // function confirmExit()
	 //  {
	 //    check_answer(brain_data);
	 //  }
	 $(".quit-quiz").click(function(){
	 	check_answer(brain_data);
	 });
	 $(".previous").click(function(){
		var activeElement = $('.active');
		// if(!activeElement.find('question:first')){
			if(activeElement.prev('question:first').length){
				checkAnswers(brain_data);
				activeElement.removeClass('active').prev().addClass('active');
				question_number--;
				$(".question_number").html('');
				$(".question_number").html('Question '+ question_number);
			}
	});
});
function check_answer(data){
	var yes  = prompt('Are you sure you want to submit the quiz, type yes?')
	console.log(data, yes);
	
	if(yes && yes.toLowerCase() === 'yes' && data.length){
		$.ajax({
			method: 'POST',
			url: '/check',
			data: JSON.stringify(data),
			contentType: 'application/json'
		})
		.done(function(){
			window.onbeforeunload = function () {
				return true;}
		});
		window.location.reload()
	}else{
		alert('attempt atleast one ques!!');
	}
}

function checkAnswers(array) {
	console.log(array);
	array.forEach(function(dta){
		$('.' + dta.class).prop('checked', true);
	})
}

function check_answer_automatically(data){
	var payload  = data || []
		$.ajax({
			method: 'POST',
			url: '/check',
			data: JSON.stringify(payload),
			contentType: 'application/json'
		})
		.done(function(){
			window.onbeforeunload = function () {
				return true;}
		});
		window.location.reload()
}
