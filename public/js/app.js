var critterApp = (function() {
	var critter,
		stage,
		friend,
		friend_stage;
			
	var Critter = Backbone.Model.extend({
		url: '../api/critters/' + username,
		initialize: function (username) {
			this.fetch({url: '../api/critters/' + username});
		}
	});
	
	var	your_critter = new Critter(username);
	
	function init() {
		var	elem = document.getElementById('your-critter'),
			critter_container = new Container();
		
		stage = new Stage(elem);
		friend_stage = new Stage(elem);

		stage.snapToPixelEnabled = true;
		friend_stage.snapToPixelEnabled = true;
		friend_stage.autoClear = false;
		friend_stage.x = 400;
		
		critter = build(your_critter, stage, critter_container);
		
		if (document.getElementById('flash_Fisticuffs') && !document.getElementById('attributes')) {
			//initial new fight
			var str = document.getElementById('flash_Fisticuffs').textContent,
				strings = str.split(' '),
				critter_container2 = new Container();
			friend = new Critter(strings[1]);
			theirs = build(friend, friend_stage, critter_container2);
		}
				
		if ($('.alert')) {
			var	heights = [];
			var set = $('.alert').clone();
			set.appendTo('#content');
			set.slideDown(0);

			for (var i=0; i < set.length; i+=1) { 
				set[i].style.visibility = 'hidden'; 
				heights.push(set[i].clientHeight);
			}
			
			set.remove();
						
			for (var j=0; j < heights.length; j+=1) {
				if (j !== 0) $('.alert')[j].style.top = 18 + heights[j-1] + 'px';
			}
			$('.alert').slideToggle(750);
			$('.weapon_selection').css('display','none');
		}
	}
	
	function getYours() {
		return critter;
	}
	
	function getTheirs() {
		return friend;
	}
	
	function getYourCritterModel() {
		return your_critter;
	}
		
	function getStage() {
		return stage;
	}
	
	function getTheirStage() {
		return friend_stage;
	}
	
	function getCritterModel() {
		return Critter;
	}
	
	function newCritter(username) {
		return new Critter(username);
	}
	
	function setFriend(newFriend) {
		friend = newFriend;
		return friend;
	}
	
	return {
		init: init,
		yours: getYours,
		theirs: getTheirs,
		yourStage: getStage,
		theirStage: getTheirStage,
		model: getCritterModel,
		critter: newCritter,
		yourModel: getYourCritterModel,
		setFriend: setFriend
	}
}());

critterApp.init();