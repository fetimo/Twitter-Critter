$(document).ready(function() {
	$('.friend').draggable({
		revert: true,
		helper: 'clone',
		containment: 'document',
		zIndex:10000,
        appendTo: "body"
	});
	$('#your-critter').droppable({
		drop: function (event, ui) {
			try {
				//critter_container2 === undefined isn't working in Safari so resorted to try/catch
				if (critter_container2) {
					critter_container2.removeAllChildren();
					stage.update();
				}
			} catch(e) {
				critter_container2 = new Container();
			}
			var username = ui.draggable.context.id,
				friend = new Critter(username);
			build(friend);
		}
	});
});