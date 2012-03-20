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
	
	function sendTweet() {
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid='+your_critter.get('uid')+'&opponent='+ friend.get('uid')+'&approve_tweet=1',
			//success: tweeted
		});
	}
	
	function stopFighting(a) { 
		$.ajax({
			type: 'DELETE',
			url: 'http://crittr.me/api/battle?uid='+your_critter.get('uid'),
			//data: data,
			success: function(){
				var alert = document.createElement('div');
				var root = document.getElementById('content');		
					//not an error, can show tweet related things
				alert.className = 'alert alert-success fade in';
				alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>You\'ve hugged and made up with ' + friend.get('name') + ' :)</p>';
				root.appendChild(alert);
				$(".alert").alert();
			}
		}); 
	}
	
	function prepFight() {
		$('.weapon_selection').css('display', 'block');
		$('.weapon_selection img').on('click', clickedWeapon);
	}
	
	function prepFightRetaliate() {
		$('.weapon_selection').css('display', 'block');
		$('.weapon_selection img').on('click', clickedWeaponRetaliate);
	}
	
	function success(response) {
		var alert = document.createElement('div');
		var root = document.getElementById('content');	
		if (response.response.substring(0,5) !== 'Error') {
			//not an error, can show tweet related things
			alert.className = 'alert alert-info fade in';
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Is it ok if I tweet them this message to let them know you\'re fighting them? "' + response.response + '"</p><p><a class="btn btn-info" href="#"><span id="tweet">Tweet</span></a><a class="btn close_btn" href="#">No, thanks</a></p>';
		} else {
			//there be errors
			alert.className = 'alert alert-error';
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p><strong>Error!</strong> "' + response.response.substring(7) + '"</p>';
		}
		root.appendChild(alert);
		$(".alert").alert();
		$('.close_btn').on('click', function() {
			$(".alert").alert('close');
		});
		$('#tweet').on('click', sendTweet);
	}
	
	function tweeted() {
		//confirm tweet sent
	}
	
	function clickedWeapon(e) {
		weapon = e.currentTarget.name;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid='+your_critter.get('uid')+'&opponent='+ friend.get('uid') +'&weapon=' + weapon,
			success: success
		});
		$('.weapon_selection').css('display','none');
	}
	
	function clickedWeaponRetaliate(e) {
		weapon = e.currentTarget.name;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?update=1&uid='+your_critter.get('uid')+'&weapon=' + weapon,
			//success: success
		});
		$('.weapon_selection').css('display','none');
	}
	
	$('#fisticuffs').on('click', prepFight);
		
	if ($('.Fisticuffs').length) {
		$('.Fisticuffs a').on('click', prepFightRetaliate);
	}
	
	$('#hug').on('click', stopFighting);
});