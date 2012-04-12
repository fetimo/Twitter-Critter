$(document).ready(function() {
//	$('.friend').draggable({
//		revert: true,
//		helper: 'clone',
//		containment: 'document',
//		zIndex: 10000,
//        appendTo: "body"
//	});
//	$('#your-critter').droppable({
//		drop: function(event, ui) { loadFriend(event, ui) }
//	});
	
	function loadFriend (event, ui) {
		ui === undefined ? ui = event.currentTarget.id : ui =  ui.draggable.context.id;
		if (theirs) {
			theirs.getContainer().removeAllChildren();
			critterApp.yourStage().update();
		} else {
			var their_critter;
		}		
		var username = ui,
			critter_container2 = new Container();
		var Critter = critterApp.model();
		friend = new Critter(username);
		$('.loader').fadeIn(400, function() {
			$('.loader').css('visibility', 'visible');
		});
		var friend_stage = critterApp.theirStage();
		theirs = build(friend, friend_stage, critter_container2);
		their_critter = theirs;
		if ($('.friends_tab').css('display') === 'none') { 
			$('.friends_tab').slideDown('quick', function (){
				$('.friends_tab').css('display','block');
			});
		}
	}
	
	function sendTweet() {
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid='+ critterApp.yourModel().get('uid')+'&opponent='+ friend.get('uid')+'&approve_tweet=1',
			success: function() {
				$('.alert').remove();
				
				var alert = document.createElement('div');
				var root = document.getElementById('content');		
					//not an error, can show tweet related things
				alert.className = 'alert alert-success fade in';
				alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Cool, that\'s been tweeted for you!</p>';
				alert.style.display = 'block';
				root.appendChild(alert);
				$(".alert").alert();
			}
		});
	}
	
	function stopFighting() { 
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid') + '&friend=' + friend.get('name'),
			success: function(){
				var alert = document.createElement('div');
				var root = document.getElementById('content');		
					//not an error, can show tweet related things
				alert.className = 'alert alert-success fade in';
				alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>You\'ve hugged ' + friend.get('name') + ' :)</p>';
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
		alert.style.display = 'block';
		if (response.response.substring(0,5) !== 'Error') {
			//not an error, can show tweet related things
			alert.className = 'alert alert-info';
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Is it ok if I tweet them this message to let them know you\'re fighting them? "' + response.response + '"</p><p><a class="btn btn-info" href="#"><span id="tweet">Tweet</span></a><a class="btn close_btn" href="#">No, thanks</a></p>';
		} else {
			//there be errors
			alert.className = 'alert alert-error';
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p><strong>Error!</strong> "' + response.response.substring(7) + '"</p>';
		}
		root.appendChild(alert);
		$('.close_btn').on('click', function() {
			$(".alert").alert('close');
		});
		$('#tweet').on('click', sendTweet);
	}
	
	function clickedWeapon(e) {
		weapon = e.currentTarget.name;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid') + '&opponent=' + friend.get('uid') + '&weapon=' + weapon,
			success: success
		});
		$('.weapon_selection').css('display','none');
	}
	
	function clickedWeaponRetaliate(e) {
		weapon = e.currentTarget.name;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?update=1&uid='+ critterApp.yourModel().get('uid')+'&weapon=' + weapon,
			//success: success
		});
		$('.weapon_selection').css('display','none');
	}
	// click handlers	
	$('#fisticuffs').on('click', prepFight);
	$('.friend').on('click', loadFriend);
	$('#hug').on('click', stopFighting);
	
	if ($('.Fisticuffs').length) {
		$('.Fisticuffs p a').on('click', prepFightRetaliate);
	}
});