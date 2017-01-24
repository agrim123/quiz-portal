$('document').ready(function () {
	$.ytLoad();
	$('.submit').click(function(){
		$('#ajaxContent').load('ajax.html');
	});
	$(window).load(function(){
		$("#loader").fadeOut("slow");
	});
	$(".main question").first().addClass('active');
	if($('.main question').first().hasClass('active')){
		$("#back").hide();
	}
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
	})
	$('.submit').on('click',function() {
		$(this).removeClass('submit');
		$('#form-messages').html('');
		var data = {
			question_id: $('.active #id').val(),
			answer: $(".active #answer").val()
		}
		/*console.log(data);*/
		if(!data.answer){
			$('#form-messages').html('');
			$('#form-messages').append("Empty answer not accepted");
		}else{
			check_answer(data);
		}
	});
});
function check_answer(data){
	$.ajax({
		method: 'POST',
		url: '/check',
		data: JSON.stringify(data),
		contentType: 'application/json'/*,
		beforeSend: function() {
			$("#question_loader").css("display","block");
		},
		complete: function() {
			$("#question_loader").css("display","none");
		}*/
	})
	.done(function(response) {
		if(response === "200"){
			var activeElement = $('.active');
			if(activeElement.next().length){
				activeElement.removeClass('active').next().addClass('active');
				$(".question_number").html('');
				$(".question_number").html('Question ');
			}
			else{
				if($(".main > question:last").hasClass('active')){
					window.location.reload();
				}
				activeElement.removeClass('active').closest('.main').find('> question:last').addClass('active');
			}
		}else if(response === "201"){
			$('#form-messages').html('').append("Already Submitted");
			window.location.reload();
		}else if(response === "202"){
			$('#form-messages').html('').append("Empty answer not accepted");
		}else if(response === "203"){
			$('#form-messages').html('').append("Please donot include special character in answer.");
		}else{
			$('#form-messages').html('').append("Unknown Error please refresh to continue..");
		}
	});
	
}