$(document).ready(function() {
	$('#carousel_inner ul li:first').before($('#carousel_inner ul li:last'));
	$('#right_scroll img').click(function(){
		var left_indent = parseInt($('#carousel_inner ul').css('left')) - $('#carousel_inner ul li').outerWidth();
		$('#carousel_inner ul').animate({'left': left_indent}, 200, function(){
			$('#carousel_inner ul li:last').after($('#carousel_inner ul li:first'));
			$('#carousel_inner ul').css({'left': '0px'});
		});
	});
	$('#left_scroll img').click(function(){
		var left_indent = parseInt($('#carousel_inner ul').css('left')) + $('#carousel_inner ul li').outerWidth();
		$('#carousel_inner ul').animate({'left': left_indent}, 200, function(){
			$('#carousel_inner ul li:first').before($('#carousel_inner ul li:last'));
			$('#carousel_inner ul').css({'left': '0px'});
		});
	});
});