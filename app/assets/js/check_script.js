$('document').ready(function () {
	$(".main div").first().addClass('active');
	if($('.main div').first().hasClass('active')){
		$("#back").hide();
	}
	setInterval(function(){
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
	},5000);
	$('.submit').on('click',function() {
		$(this).removeClass('submit');
		$('#form-messages').html('');
		var data = {
			question_id: $('.active #id').val(),
			answer: $(".active #answer").val()
		}
		check_answer(data);
	});
});
function check_answer(data){
	$.ajax({
		method: 'POST',
		url: '/check',
		data: JSON.stringify(data),
		contentType: 'application/json'
	})
	.done(function(response) {
		if(response === "200"){
			var activeelement = $('.active');
			if(activeelement.next().length)
				activeelement.removeClass('active').next().addClass('active');
			else
				activeelement.removeClass('active').closest('.main').find('> div:last').addClass('active');
		}else if(response === "201"){
			$('#form-messages').html('').append("Already Submitted");
			window.location.reload();
		}else if(response === "202"){
			$('#form-messages').html('').append("Please enter a valid string not including '");
		}else{
			$('#form-messages').html('').append("Unknown Error please refresh to continue..");
		}
	});
	return;
}