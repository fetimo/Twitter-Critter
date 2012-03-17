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
			var username = ui.draggable.context.id;
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
	function notify(a) { 
		console.log(a); 
	}
	
	function prepFight() {
		$('.weapon_selection').css('display', 'block');
	}
	
	function clickedWeapon(e) {
		weapon = e.currentTarget.name;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid='+your_critter.get('uid')+'&opponent='+ friend.get('uid') +'&weapon=' + weapon,
			//data: data,
			//success: success,
			//dataType: dataType
		});
		$('.weapon_selection').css('display','none');
	}
	
	$('.weapon_selection img').on('click', clickedWeapon);
	
	$('#fisticuffs').on('click', prepFight);
	$('#hug').on('click', notify);
});