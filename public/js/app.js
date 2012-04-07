var critterApp = (function() {
	
	var critter,
		stage,
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
		
		if (document.getElementById('flash_fisticuffs')) {
			//initial new fight
			var str = document.getElementById('flash_fisticuffs').innerHTML,
				strings = str.split(' '),
				friend = new Critter (strings[0]),
				critter_container2 = new Container();
			
			theirs = build(friend, friend_stage, critter_container2);
		}
		
		if ($('.alert')) {
			$('.alert').slideToggle(750);
		}
	}
	
	
	function getYours() {
		return critter;
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
	
	return {
		init: init,
		yours: getYours,
		yourStage: getStage,
		theirStage: getTheirStage,
		model: getCritterModel,
		yourModel: getYourCritterModel
	}
}());

critterApp.init();