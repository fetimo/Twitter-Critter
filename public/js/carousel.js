$(document).ready(function() {
	$('#right_scroll img').click(function(){
		var left_indent = parseInt($('#carousel_inner ul').css('left')) - $('#carousel_inner ul li').outerWidth() * 4;
		$('#carousel_inner ul').animate({'left': left_indent}, 300, function(){
			for (var i=4; i--;) {
				$('#carousel_inner ul li:last').after($('#carousel_inner ul li:first'));
			}
			$('#carousel_inner ul').css({'left': '0px'});
		});
	});
	$('#left_scroll img').click(function(){
		var left_indent = parseInt($('#carousel_inner ul').css('left')) + $('#carousel_inner ul li').outerWidth() * 4;
		$('#carousel_inner ul').animate({'left': left_indent}, 300, function(){
			for (var i=4; i--;) {
				$('#carousel_inner ul li:first').before($('#carousel_inner ul li:last'));
			}
			$('#carousel_inner ul').css({'left': '0px'});
		});
	});
});