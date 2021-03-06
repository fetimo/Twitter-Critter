$(document).ready(function() {	
		
	function loadFriend(event) {
		jumpIn = true;
		$('#carousel_inner ul li').removeClass('active');
		event.target.className === 'friend' ?  
			event.target.className += " active" :
			event.target.parentNode.className += " active";
		
		if (critterApp.theirStage().children.length) jumpOut = true;
		if (!jumpOut || theirs.getContainer().x >= $(document).width() - 500) {
			jumpOut = false;
			oscillateJump = true;
			var username = event.currentTarget.id;
			if (theirs) {
				theirs.getContainer().removeAllChildren();
				critterApp.yourStage().update();
			} else {
				var their_critter;
			}
			var	critter_container2 = new Container(),
				Critter = critterApp.model();
			friend = new Critter(username);
			critterApp.setFriend(friend);	
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
		} else {
			_.delay(loadFriend, 100, event);
		}
	}
	
	var throttleLoadFriend = _.throttle(loadFriend, 1000); 
	
	function sendTweet() {
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid')+'&opponent=' + friend.get('uid') + '&approve_tweet=1',
			success: function() {
				$('.alert').remove();
				
				var alert = document.createElement('div'),
					root = $('.alerts')[0];
				//not an error, can show tweet related things
				alert.className = 'alert alert-success fade in';
				alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Cool, that\'s been tweeted for you!</p>';
				root.appendChild(alert);
				$(alert).slideDown(750);
				$(".alert").alert();
			}
		});
	}
	
	function stopFighting() {			
		var friend = friend || critterApp.theirs();
		hugFriend = true;
		
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid') + '&friend=' + friend.get('uid'),
			success: function() {				
				$(".hug").remove();
				var alert = document.createElement('div'),
					root = $('.alerts')[0];		
				alert.className = 'alert alert-info hug';
				alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>You\'ve hugged ' + friend.get('name') + ' :)</p>';
				root.appendChild(alert);
				$(".alert").alert();
				$(alert).slideDown(750);
			}
		}); 
	}
	
	function runAway() {			
		var friend = critterApp.theirs();
		
		$.ajax({
			type: 'PATCH',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid') + '&friend=' + friend.get('uid'),
			success: function(response) {
				$('.alert').remove();
				if (response.response.substring(0,7) === 'Success') {
					var alert = document.createElement('div'),
						root = $('.alerts')[0];
					alert.className = 'alert alert-info';
					alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>You\'ve successfully run away!</p>';
					alert.style.display = 'block';
					root.appendChild(alert);
					$('.close_btn').on('click', function() {
						$(".alert").alert('close');
					});
					
					$(alert).slideDown(750);
				}
			}
		}); 
	}
	
	function rebuildWeaponSelection() {
		if (!$('.weapon_selection').length) {
			// alert has removed the node so we're going to rebuild it
			var weapon_selection = document.createElement('section'),
				root = $('.alerts')[0];
			weapon_selection.className = "weapon_selection alert alert-info";
			weapon_selection.innerHTML = 
				"<a class='close' data-dismiss='alert'>&times;</a> \
				<h4>Choose Your Weapon</h4> \
				<img width='78' height='62' alt='Icon of rock' id='3' src='../images/weapons/rock.png'> \
				<img height='64' width='73' alt='Icon of paper' id='2' src='../images/weapons/paper.png'> \
				<img width='83' height='54' alt='Icon of scissors' id='1' src='../images/weapons/scissors.png'>";
			
			root.appendChild(weapon_selection);
		}
	}
	
	function prepFight() {
		rebuildWeaponSelection();
		$('.weapon_selection').slideToggle(750);
		$('#flash_Tutorial').css('display','block');
		if (!$('.weapon_selection img').data('events')) {
			$('.weapon_selection img').on('click', clickedWeapon); //checks to see if click handler already assigned
		}
	}
	
	function prepFightRetaliate() {
		rebuildWeaponSelection();
		$('.weapon_selection').slideToggle(750);
		if (!$('.weapon_selection img').data('events')) {
			$('.weapon_selection img').on('click', clickedWeaponRetaliate);
			//checks to see if click handler already assigned
		}
	}
	
	error_exist = false; // global on purpse so alert.js can use it (sorry)

	function success(response) {
		var alert = document.createElement('div'),
			root = $('.alerts')[0];
		alert.style.display = 'block';
		
		if (response.response.substring(0,5) !== 'Error') {
			//not an error, can show tweet related things
			alert.className = 'alert alert-info';
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Is it ok if I tweet them this message to let them know you\'re fighting them? "' + response.response + '"</p><p><a class="btn btn-info close_btn" href="#">No, thanks</a><a class="btn btn-info close_btn" href="#"><span id="tweet">Yes, Tweet</span></a></p>';
		} else {
			//there be errors
			alert.className = 'alert alert-error';			
			alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p><strong>Error!</strong> ' + response.response.substring(7) + '</p>';
		}
		
		//check to see if the same error is already displayed
		$('.alert').each(function () {
			if (this.innerHTML === alert.innerHTML) error_exist = true;	
		});
		//if there isn't, append the new error
		if (!error_exist) root.appendChild(alert);
		
		$('.close_btn').on('click', function() {
			$(".alert").alert('close');
		});
		
		$(alert).slideDown(750);
		$('#tweet').on('click', sendTweet);
	}
	
	function clickedWeapon(e) {
		var weapon = e.currentTarget.id;
		if (rps.get() !== null) rps.remove();
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?uid=' + critterApp.yourModel().get('uid') + '&opponent=' + friend.get('uid') + '&weapon=' + weapon,
			success: success
		});
		$('.weapon_selection').slideToggle(750) || rebuildWeaponSelection();
		switch (weapon) {
			case '1':
				rps.set('scissors');
			break;
			case '2':
				rps.set('paper');
			break;
			case '3':
				rps.set('rock');
			break;
		}
	}
	
	function clickedWeaponRetaliate(e) {
		var weapon = e.currentTarget.id;
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/battle?update=1&uid='+ critterApp.yourModel().get('uid')+'&weapon=' + weapon,
			complete: function() { location.reload(false); }
		});
		$('.weapon_selection').slideToggle(750) || rebuildWeaponSelection();
		$('.flash_Fisticuffs').remove();
	}
	
	function changeCritter() {
		var alert = document.createElement('div'),
			root = $('.alerts')[0];
		alert.className = 'alert alert-info';
		alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>This will make a Critter out of your most recent tweet. Are you sure you want to kill your current Critter?</p><p><a class="btn btn-info" id="kill" href="#">Yes, I do</a><a class="btn close_btn" href="#" id="do_not_kill">No, please don\'t!</a></p>';
		var change_exist = false;
		$('.alert').each(function () {
			if (this.innerHTML === alert.innerHTML) change_exist = true;	
		});
		//if there isn't, append the new alert
		if (!change_exist) root.appendChild(alert);

		$(alert).slideToggle(750);
		
		$('#kill').on('click', function() {
			killCritter(alert);
		});
		
		$('#do_not_kill').on('click', function() {
			saveCritter(alert);
		});
	}
	
	function saveCritter(alert) {
		$(alert).slideToggle(750);
		$(alert).remove();
		var alert = document.createElement('div'),
			root = $('.alerts')[0];
		alert.className = 'alert alert-info';
		alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Your Critter is still alive but please don\'t scare them like that!</p><a class="btn btn-info" href="#">Okay</a>';
		root.appendChild(alert);
		$(alert).slideToggle(750);
		$(alert).on('click', function() {
			$(alert).slideToggle(750, function() {
				$(alert).remove();
			});
		});
	}
	
	function killCritter(alert) {
		$(alert).slideToggle(750, function() {
			$(alert).remove();
		});
		
		$.ajax({
			type: 'POST',
			url: 'http://crittr.me/api/critters/'+username,
			success: function(e) {
				change = true;
			}
		});
	}
	
	function invite() {
		var change_exist = false;
		var alert = document.createElement('div'),
			root = $('.alerts')[0];
		alert.className = 'alert alert-info';
		alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Type the name of the friend that you\'d like to invite to Critter (this will send a tweet from your account):</p> \
		<input id="invitee" type="text" placeholder="Friend\'s @username" required> \
		<button id="invite-btn" class="btn btn-info">Invite</button>';
		$('.alert').each(function () {
			if (this.innerHTML === alert.innerHTML) change_exist = true;	
		});
		//if there isn't, append the new alert
		if (!change_exist) root.appendChild(alert);
		$('#invite-btn').on('click', function(evt) {
			var invitee = $('#invitee').val();
			$.ajax({
				type: 'POST',
				url: 'http://crittr.me/api/critters/' + username +'?invitee='+invitee,
				complete: function(response) {
					var callback_alert = document.createElement('div');
					if (response.responseText.substring(0,5) !== 'Error') {
						//not an error, can show tweet related things
						callback_alert.className = 'alert alert-info';
						callback_alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p>Your invite has been tweeted! :)</p>';
					} else {
						//there be errors
						callback_alert.className = 'alert alert-error';			
						callback_alert.innerHTML = '<a class="close" data-dismiss="alert">&times;</a><p><strong>Error!</strong> ' + response.responseText.substring(7) + '.</p>';
					}
					
					$('.alert').each(function () {
						if (this.innerHTML === callback_alert.innerHTML) change_exist = true;	
					});
					//if there isn't, append the new alert
					if (!change_exist) {
						root.appendChild(callback_alert);
						$(callback_alert).slideToggle(750);
					}
				}
			});
		});
		
		$(alert).slideToggle(750);
	}
	
	// click handlers	
	$('#fisticuffs').on('click', prepFight);
	$('.friend').on('click', throttleLoadFriend);
	$('#hug').on('click', stopFighting);
	$('#change').on('click', changeCritter);
	$('.invite').on('click', invite);
		
	if ($('.Fisticuffs').length) {
		$('.Fisticuffs a.btn-success').on('click', prepFightRetaliate);
		$('.Fisticuffs a.btn-danger').on('click', runAway);
	}
});
