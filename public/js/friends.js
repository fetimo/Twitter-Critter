$(document).ready(function() {
	$('.friend').draggable({
		revert: true
	});
	$('#content').droppable({
		drop: function (event, ui) {
			var username = ui.draggable.context.id,
				friend = new Critter(username);
			build(friend);
		}
	});
});