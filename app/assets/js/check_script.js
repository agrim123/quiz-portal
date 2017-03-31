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
	var $img = $('#question_images');
	
	$('#myModal').modal();
	$("#leaderboard").click(function(){
		$.ajax({
			method: 'GET',
			url: '/leaderboard',
			contentType: 'application/json'
		})
		.done(function(response) {
			$('.leaderboard').html('');
			for(i=0;i<response.length;i++){
				$(".leaderboard").append('\
					<div class="row" style="padding:10px"><div class="col-sm-4 col-sm-offset-3">' + response[i].username + '</div>\
					<div class="col-sm-3">Level ' + response[i].score + '</div></div>\
					');
			}
		});
	});
	$("#answer").keyup(function(event){
		if(event.keyCode == 13){
			$('.submit').removeClass('submit');
			$('#form-messages').html('');
			var data = {
				question_id: $('#question_id').val(),
				answer: $("#answer").val()
			}
			if(!data.answer){
				$('#form-messages').html('');
				$('#form-messages').append("Empty answer not accepted");
			}else{
				check_answer(data);
			}
		}
	});
	$('.submit').on('click',function() {
		$(this).removeClass('submit');
		$('#form-messages').html('');
		var data = {
			question_id: $('#question_id').val(),
			answer: $("#answer").val()
		}
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
		contentType: 'application/json',
		beforeSend: function(){
			$("#ajax-messages").html('').append('Submitting answer...');
		}

	})
	.done(function(response) {
		$("#ajax-messages").html('');
		if(response === "200"){
			window.location.reload();
		}else if(response === "201"){
			$('#form-messages').html('').append("Already Submitted");
			window.location.reload();
		}else if(response === "202"){
			$('#form-messages').html('').append("Empty answer not accepted");
		}else if(response === "203"){
			$('#form-messages').html('').append("Please donot include special character in answer.");
		}else if(response === "204"){
			$('#form-messages').html('').append("Your answer is incorrect!");
		}else if(response === "205"){
			$('#form-messages').html('').append("Quiz has either not yet started or has ended!");
		}else if(response === "206"){
			$('#form-messages').html('').append("Please solve previous questions first! Redircting you to correct question...");
			setTimeout(function(){
				location.reload();
			},2000);
		}else{
			$('#form-messages').html('').append("Unknown Error please refresh to continue..");
		}
	});
	
}