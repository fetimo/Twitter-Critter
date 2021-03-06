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
		
		elem.width = $(document).width() - 400; //to account for right tree trunk
		
		function updateCanvasWidth() {
			elem.width = $(document).width() - 400;
			return elem.width;
		}
		
		var resize = _.throttle(updateCanvasWidth, 1000);
		$(window).resize(resize);
		
		stage = new Stage(elem);
		friend_stage = new Stage(elem);

		stage.snapToPixelEnabled = true;
		friend_stage.snapToPixelEnabled = true;
		friend_stage.autoClear = false;
		friend_stage.x = 400;
		friend_stage.name = 'friend_stage';
		
		critter = build(your_critter, stage, critter_container);
		
		if (document.getElementById('flash_Fisticuffs') && !document.getElementById('attributes')) {
			//initial new fight
			var str = document.getElementById('flash_Fisticuffs').textContent,
				strings = str.split(' '),
				critter_container2 = new Container();
			if (strings[1] !== 'The') friend = new Critter(strings[1]);
			theirs = build(friend, friend_stage, critter_container2);
		}
				
		if ($('.alert')) {
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
	
	function screenshot() {
		var canvas 	= document.getElementById("your-critter"),
			img		= canvas.toDataURL("image/png");
		return img;
	}
	
	return {
		init		: init,
		yours		: getYours,
		theirs		: getTheirs,
		yourStage	: getStage,
		theirStage	: getTheirStage,
		model		: getCritterModel,
		critter		: newCritter,
		yourModel	: getYourCritterModel,
		setFriend	: setFriend,
		getImage	: screenshot
	}
}());

critterApp.init();