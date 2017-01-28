$('document').ready(function () {
	$.ytLoad();
	/*$('.submit').click(function(){
		$('#ajaxContent').load('ajax.html');
	});*/
	var question_number = 1;
	$(window).load(function(){
		$("#loader").fadeOut("slow");
	});
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
	/*$("#leaderboard").click(function(){
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
	});*/
	var brain_data = new Array();
	$('.submit').on('click',function() {
		$(this).removeClass('submit');
		$('#form-messages').html('');
		var data = {
			question_id: $('.active #id').val(),
			answer: document.querySelector('input[name="answer"]:checked').value
		}
		brain_data.push(data);
		var activeElement = $('.active');
		if(activeElement.next().length){
			activeElement.removeClass('active').next().addClass('active');
			question_number++;
			$(".question_number").html('');
			$(".question_number").html('Question '+ question_number);
		}
		else{
			if($(".main > question:last").hasClass('active')){
				check_answer(brain_data);
				window.location.reload();
			}
			activeElement.removeClass('active').closest('.main').find('> question:last').addClass('active');
		}
		/*if(!data.answer){
			$('#form-messages').html('');
			$('#form-messages').append("Empty answer not accepted");
		}else{
			check_answer(data);
		}*/
	});
	window.onbeforeunload = function() {
		check_answer(brain_data);
	}
});
function check_answer(data){
	if(data){
		$.ajax({
			method: 'POST',
			url: '/check',
			data: JSON.stringify(data),
			contentType: 'application/json'
		})
		.done(function(){

			window.location = '/leaderboard';
		});
	}else{
		alert('attempt atleast one ques!!');
	}
}