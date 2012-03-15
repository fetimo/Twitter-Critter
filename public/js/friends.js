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
				if (critter_container2 !== undefined || critter_container2 !== null) {
					critter_container2.removeAllChildren();
					stage.update();
				}
			} catch(e) {
				critter_container2 = new Container();
			}
			var username = ui.draggable.context.id,
				friend = new Critter(username);
			$('.loader').css('display', 'block');
			build(friend);
			
			if($('.friends_tab').css('display') === 'none') { 
				$('.friends_tab').slideDown('quick', function (){
					$('.friends_tab').css('display','block');
				});
			}
		}
	});
});