var wave = 0,
	rub = 0,
	oscillate = true,
	oscillateHug = true,
	oscillateTheirs = true,
	hugFriend = false,
	jiggle = false,
	jiggleTheirs = false,
	change = false,
	jumpOut = false,
	theirs;

function animateEyes(critter) {
	
	for (var i=0; i < critter.children.length; i+=1) { 
		if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'eyes') {
			var eyes = critter.children[i],
			pupils = eyes.children[1];
			break;
		}
	}
	
	if (eyes) {
		if (eyes.name === 'eyes small_black') {
			pupils = eyes.children[0];
		}
		
		var eyeAnimations = [0,1,2], //array of available functions
			waitTime = Math.round(2000+(Math.random()*(8000-2000))),
			pupils = eyes.children[1];	
		/*
		if (eyes.name === 'eyes small_black') {
			pupils = eyes.children[0];
		}
		
		//this makes the small black eyes move, but it doesn't look very good
		if (pupils.parent.name === 'small_black') {
			pupils = pupils.parent;
		}
		*/
		
		/* actual animations */
		function leftToRight() {
			try {
				if (eyes.name !== 'eyes small_black') {
					if (pupils.x <= 3) {
						pupils.x += Math.round(Math.random()*3.5);
					} else {
						setTimeout(function() { pupils.x -= 3 }, waitTime);
					}
				}
			} catch(e) {}
		}
		
		function upDown() {
			try {
				if (eyes.name !== 'eyes small_black') {
					if (pupils.y < 3) {
						pupils.y += Math.round(Math.random()*4);
					} else { 
						setTimeout(function() { pupils.y -= 3 }, waitTime);
					}
				}
			} catch(e) {}
		}
		
		function blink() {
			try {
				var el = eyes.children[2],
					el2 = eyes.children[3];
				if (eyes.name === 'eyes small_black') {
					el = eyes.children[1];
					el2 = eyes.children[2];
				}	
				el.visible = true;
				el2.visible = true;
				function clearBlink(el,el2) {
					el.visible = false;
					el2.visible = false;
				}
				var blinkTime = Math.round(99+(Math.random()*(100))); //blinking lasts between 200 to 300ms
				_.delay(clearBlink, blinkTime, el, el2);
			} catch(e) {}
		}
		
		var animate = Math.round(Math.random()*eyeAnimations.length); //grab a random animation
		//check which animation will be played
		if (animate === 0 || animate === 1) {
			leftToRight();
		} else if (animate === 2) {
			upDown();
		} else if (animate === 3) {
			blink();
		}
	}
}

function hug(critter) {
	if (critter) {
		for (var i=0; i < critter.children.length; i+=1) { 
			if (critter.children[i].name) {
				if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'arms') {
					var arms = critter.children[i];
				} else if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'long' || critter.children[i].name.substr(0,5) === 'short') {
					var legs = critter.children[i];
				}
			}
		}
		
		if (wave === 42 && arms) {
			//sidle next to them
			//raise arm
			var lArm = arms.children[0];
			var rArm = arms.children[1];
			
			if (rArm.rotation >= 360) rArm.rotation = 0;
			if (lArm.rotation >= 360) lArm.rotation = 0;
			
			if (rub <= 2) {
				if (critter.x < 115) critter.x += 5;
				if (legs.children[0].rotation < 5) {
					legs.children[0].rotation += .5;
					legs.children[1].rotation += .5;
					legs.children[0].y -= 2;
					legs.children[1].y -= 2;
				}
				if (lArm.rotation === 0 || lArm.rotation > -90) {
					//finished rubbing
					lArm.rotation -= 5;
				}
				//lArm.rotation = 5 when stationary
				
				if (oscillateHug) {
					rArm.rotation += 2.5;
					if (rArm.rotation > 290) {
						oscillateHug = false;
						rub += 1;
					}
				} else if (!oscillateHug){
					rArm.rotation -= 2.5;
					if (rArm.rotation <= 270) oscillateHug = true;
				}
			} else {				
				if (legs.children[0].rotation >= 0) {
					legs.children[0].rotation -= .5;
					legs.children[1].rotation -= .5;
					legs.children[0].y += 2;
					legs.children[1].y += 2;
				}
				if (lArm.rotation !== 0) {
					//finished waving
					lArm.rotation += 5;
				}
				if (rArm.rotation > 180) rArm.rotation -= 5;
				if (critter.x > 70) critter.x -= 5;
				if (critter.x === 70 && lArm.rotation >= 0) {
					//reset arm rotation values to initial values
					lArm.rotation = 0;
					rArm.rotation = 180;
					hugFriend = false;
					rub = 0;
				}
			}
		}
	}
}

function kill(critter) {
	critter.alpha -= .02;
	wave = 0;
	critterApp.theirStage().removeAllChildren();
	
	if (critter.alpha <= 0) {
		change = false;
		critterApp.yours().getContainer().alpha = 1;
		critterApp.yourStage().removeAllChildren();
		var critter = critterApp.yourModel();
		var name = critter.attributes.name;
		var your_critter = critterApp.critter(name);
				
		critter = build(your_critter, critterApp.yourStage(), critterApp.yours().getContainer());
	}
}

function animateArms(critter) {
		
	for (var i=0; i < critter.children.length; i+=1) { 
		if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'arms') {
			var arms = critter.children[i];
			arms.uncache();
			break;
		}
	}
	
	if (wave !== 42 && critter.id === 7 && arms) {
		var lArm = arms.children[0];
		if (wave <= 2) {
			if (lArm.scaleY > -1) lArm.scaleY -= .4;
			if (oscillate) {
				lArm.rotation += 5;
				if (lArm.rotation > 60) { oscillate = false; wave += 1; }
			} else if (!oscillate){
				lArm.rotation -= 5;
				if (lArm.rotation <= 0) { oscillate = true; }
			}
		} else {
			if (lArm.scaleY < 1) lArm.scaleY += .5;
			if (lArm.rotation > 0) lArm.rotation -= 5;
			if (lArm.scaleY === 1 && lArm.rotation === 0) wave = 42; // 42 = waving has finished, used by hug(), dirty reuse of a variable
		}
		//arms.uncache();
	} else {
		if (jiggle && !hugFriend && critter.id === 7 && arms) {			
			//jiggle arms
			var lArm = arms.children[0];
			var rArm = arms.children[1];
			var speed = Math.round(Math.random()*8);
			
			if (rArm.rotation === 360 || rArm.rotation === -360) rArm.rotation = 0;
			if (oscillate) {
				rArm.rotation += speed;
				lArm.rotation += speed;
				if (rArm.rotation > 220) {
					oscillate = false;
				}
			} else {
				rArm.rotation -= speed;
				lArm.rotation -= speed;
				if (rArm.rotation <= 180) oscillate = true;
			}
		}
		if (jiggleTheirs && !hugFriend && critter.id !== 7) {			
			//jiggle arms
			var tlArm = arms.children[0];
			var trArm = arms.children[1];
			var speed = Math.round(Math.random()*8);
			
			if (trArm.rotation === 360 || trArm.rotation === -360) trArm.rotation = 0;
			if (oscillateTheirs) {
				trArm.rotation += speed;
				tlArm.rotation += speed;
				if (trArm.rotation > 220) {
					oscillateTheirs = false;
				}
			} else {
				trArm.rotation -= speed;
				tlArm.rotation -= speed;
				if (trArm.rotation <= 180) oscillateTheirs = true;
			}
		}
	}
}

var rps = (function() {
	
	var weapon;
	
	function addToStage(graphic) {
		var rps = new Shape(graphic);
		rps.snapToPixel = true;
		rps.scaleX = .5;
		rps.scaleY = .5;
		rps.name = graphic.name;
		if (rps.name === 'rock') {
			rps.rotation = -45;
			rps.regX = 25;
			rps.regY = 15;
			rps.x = 50;
		} else if (rps.name === 'paper') {
			rps.skewX = 200;
			rps.skewY = 30;
			rps.scaleX = -.5;
			rps.scaleY = -.5;
			rps.x = 120;
		} else {
			rps.x = 25;
			rps.regY = -60;
			rps.regX = 60;
			rps.rotation = -30;
		}
		critterApp.yourStage().addChild(rps);
		weapon = rps;
		return rps;
	}
	
	function getWeapon() {
		return weapon || null;
	}
	
	function removeWeapon() {
		var remove = critterApp.yourStage().removeChild(weapon);
		weapon = null;
		return remove;
	}
	
	function setWeapon(weapon) {
		//makes rock, paper and scissors
		switch (weapon) {
			case 'rock':
				var rock = new Graphics();
				rock.moveTo(0,0);
				rock.lineTo(157,0);
				rock.lineTo(157,120);
				rock.lineTo(0,120);
				rock.closePath();
				rock.setStrokeStyle(1, 0, 0, 4);
				rock.beginFill("#98999a");
				rock.moveTo(16.171,113.93);
				rock.bezierCurveTo(12.258,108.308,5.634,101.597,3.681,95.085);
				rock.bezierCurveTo(2.554,91.326,2.934,86.211,2.566,82.26);
				rock.bezierCurveTo(1.859,74.676,-0.298,67.168,0.035,59.508);
				rock.bezierCurveTo(0.365,51.913,3.724,44.5841,6.113,37.439);
				rock.bezierCurveTo(8.363,30.7050,9.408,20.744,16.124,17.096);
				rock.bezierCurveTo(21.184,14.349,26.453,11.854,31.624,9.302);
				rock.bezierCurveTo(47.944,1.248,69.843,-1.628,87.751,0.878);
				rock.bezierCurveTo(97.481,2.239,107.2,3.925,116.9511,4.984);
				rock.bezierCurveTo(124.869,5.844,130.314,17.079,133.837,23.093);
				rock.bezierCurveTo(138.885,31.71,143.021,40.81,147.395,49.778);
				rock.bezierCurveTo(149.238,53.556,152.201,57.69,153.333,61.75);
				rock.bezierCurveTo(155.483,69.456,156.464,79.011,156.8,86.969);
				rock.bezierCurveTo(157.475,102.988,139.351,108.8151,127,112);
				rock.bezierCurveTo(109.481,116.524,91.3,117.404,73.312,118.329);
				rock.bezierCurveTo(62.188,118.901,51.052,120.807,39.892,119.908);
				rock.bezierCurveTo(35.524,119.556,18.793,117.697,16.171,113.93);
				rock.closePath();
				rock.beginFill("#919293");
				rock.moveTo(156.806,88.318);
				rock.bezierCurveTo(156.729,88.423,156.651,88.528,156.574,88.631);
				rock.bezierCurveTo(137.575,114.013,124.63,109.326,79.199,114.679);
				rock.bezierCurveTo(33.589,120.052,2.924,89.938,2.903,89.918);
				rock.bezierCurveTo(3.013,91.752,3.216,93.534,3.681,95.084);
				rock.bezierCurveTo(5.634,101.596,12.258,108.307,16.171,113.929);
				rock.bezierCurveTo(18.793,117.697,35.524,119.555,39.891,119.908);
				rock.bezierCurveTo(51.051,120.806,62.187,118.901,73.311,118.329);
				rock.bezierCurveTo(91.298,117.404,109.48,116.524,126.999,112.002);
				rock.bezierCurveTo(138.996,108.906,156.435,103.316,156.806,88.318);
				rock.closePath();
				rock.beginFill("#919293");
				rock.moveTo(24.521,64.056);
				rock.bezierCurveTo(24.521,64.056,27.534,74.491,24.22,81.127);
				rock.bezierCurveTo(24.22,81.127,27.407,76.554,26.199,69.68);
				rock.bezierCurveTo(26.199,69.68,25.385,65.431,24.521,64.056);
				rock.closePath();
				rock.beginFill("#828384");
				rock.moveTo(2.902,89.918);
				rock.bezierCurveTo(2.902,89.918,4.949,88.656,9.449,89.918);
				rock.bezierCurveTo(13.949,91.18,18.199,92.43,20.199,99.68);
				rock.bezierCurveTo(22.199,106.93,22.207,108.18,21.699,112.43);
				rock.bezierCurveTo(21.191,116.68,21.191,116.68,21.191,116.68);
				rock.lineTo(23.647,117.376);
				rock.lineTo(22.699,110.903);
				rock.bezierCurveTo(22.699,110.903,22.949,103.679,22.449,101.929);
				rock.bezierCurveTo(21.949,100.179,20.729,89.429,6.09,88.179);
				rock.lineTo(2.902,85.929);
				rock.lineTo(2.902,89.918);
				rock.closePath();
				rock.beginFill("#828384");
				rock.moveTo(22.472,102.761);
				rock.bezierCurveTo(21.815,100.215,22.743,88.355,22.866,87.014);
				rock.bezierCurveTo(23.004,85.509,22.73,83.431,24.032,81.431);
				rock.bezierCurveTo(25.334,79.431,25.699,77.43,26.199,75.43);
				rock.bezierCurveTo(26.7,73.43,26.199,69.68,26.199,69.68);
				rock.bezierCurveTo(26.199,69.68,27.394,74.93,26.422,78.68);
				rock.bezierCurveTo(25.45,82.43,24.617,82.93,24.408,87.68);
				rock.bezierCurveTo(24.199,92.43,22.699,110.904,22.699,110.904);
				rock.lineTo(22.472,102.761);
				rock.closePath();
				rock.beginFill("#919293");
				rock.moveTo(77.814,4.947);
				rock.bezierCurveTo(77.814,4.947,96.149,8.52,117.298,18.26);
				rock.lineTo(112.145,14.817);
				rock.bezierCurveTo(112.145,14.817,99.263,9.71,87.449,5.492);
				rock.bezierCurveTo(84.258,4.354,80.059,4.647,77.814,4.947);
				rock.closePath();
				rock.beginFill("#898a8c");
				rock.moveTo(25.89,68.683);
				rock.lineTo(25.51,66.127);
				rock.bezierCurveTo(25.51,66.127,26.262,67.785,25.89,68.683);
				rock.closePath();
				rock.beginFill("#898a8c");
				rock.moveTo(25.241,65.597);
				rock.lineTo(24.521,63.764);
				rock.bezierCurveTo(24.521,63.764,25.241,64.68,25.241,65.597);
				rock.closePath();
				rock.beginFill("#828384");
				rock.moveTo(23.43,101.652);
				rock.bezierCurveTo(23.43,101.652,46.074,106.804,55.699,114.179);
				rock.bezierCurveTo(55.699,114.179,61.177,115.697,62.449,117.375);
				rock.bezierCurveTo(63.721,119.053,64.939,118.945,64.939,118.945);
				rock.lineTo(61.12,119.28);
				rock.bezierCurveTo(61.2,119.28,61.84,119.321,61.574,117.875);
				rock.bezierCurveTo(61.308,116.429,56.074,115.054,55.324,114.929);
				rock.bezierCurveTo(54.574,114.804,42.914,106.456,23.369,102.443);
				rock.lineTo(23.43,101.652);
				rock.closePath();
				rock.beginFill("#828384");
				rock.moveTo(106.979,3.719);
				rock.lineTo(108.116,8.597);
				rock.bezierCurveTo(108.116,8.597,126.058,29.714,139.671,33.906);
				rock.lineTo(138.347,31.316);
				rock.bezierCurveTo(138.347,31.316,138.2,31.993,137.262,31.805);
				rock.bezierCurveTo(136.324,31.617,114.95,16.117,109.074,8.617);
				rock.bezierCurveTo(109.074,8.617,107.949,4.805,107.949,4.492);
				rock.bezierCurveTo(107.949,4.179,108.626,3.948,108.626,3.948);
				rock.lineTo(106.979,3.719);
				rock.closePath();
				rock.beginFill("#828384");
				rock.moveTo(114.974,15.968);
				rock.bezierCurveTo(114.974,15.968,93.731,7.262,87.715,5.566);
				rock.bezierCurveTo(87.622,5.54,87.533,5.515,87.448,5.493);
				rock.bezierCurveTo(81.823,3.993,113.198,14.493,119.26,19.618);
				rock.lineTo(114.974,15.968);
				rock.closePath();
				rock.name = 'rock';
				addToStage(rock);
				return rock;
			break;
			case 'paper':
				var paper = new Graphics();
				paper.setStrokeStyle(1, 0, 0, 4);
				paper.moveTo(0,0);
				paper.lineTo(87,0);
				paper.lineTo(87,121);
				paper.lineTo(0,121);
				paper.closePath();
				paper.beginFill("#efefef");
				paper.moveTo(87.334,121);
				paper.lineTo(0,121);
				paper.lineTo(0,0);
				paper.lineTo(53.667,0);
				paper.lineTo(68.334,23.666);
				paper.lineTo(87.334,39.666);
				paper.lineTo(87.334,121);
				paper.closePath();
				paper.beginFill("#ffffff");
				paper.moveTo(53.667,0);
				paper.lineTo(87.334,39.666);
				paper.lineTo(53.667,39.666);
				paper.lineTo(53.667,0);
				paper.closePath();
				paper.beginFill("#e2e4e5");
				paper.moveTo(87.334,79.334);
				paper.lineTo(53.667,39.666);
				paper.lineTo(87.334,39.666);
				paper.lineTo(87.334,79.334);
				paper.closePath();
				paper.name = 'paper';
				addToStage(paper);
				return paper;
			break;
			case 'scissors':
				var scissors = new Graphics();
				scissors.moveTo(0,0);
				scissors.lineTo(166,0);
				scissors.lineTo(166,87);
				scissors.lineTo(0,87);
				scissors.closePath();
				scissors.setStrokeStyle(1,0,0,4);
				scissors.beginFill("#e2e4e5");
				scissors.moveTo(3.945,10.241);
				scissors.bezierCurveTo(3.945,10.241,11.605,-4.679,29.889,3);
				scissors.lineTo(111.107,34.068);
				scissors.lineTo(106.956,49.319);
				scissors.lineTo(3.945,10.241);
				scissors.closePath();
				scissors.beginFill("#efefef");
				scissors.moveTo(0,50.541);
				scissors.bezierCurveTo(0,50.541,-0.252,66.28,20.9,61);
				scissors.lineTo(104.297,42.64);
				scissors.lineTo(106.955,26.841);
				scissors.lineTo(0,50.541);
				scissors.closePath();
				scissors.beginFill("#231f20");
				scissors.arc(91.663,37.31,3.847,0,6.283185307179586,true);
				scissors.closePath();
				scissors.beginFill("#c64638");
				scissors.moveTo(164.139,63.058);
				scissors.bezierCurveTo(164.075,62.676,163.973,62.302,163.826,61.939);
				scissors.bezierCurveTo(161.795,55.971,154.038,52.904,145.071,49.381);
				scissors.bezierCurveTo(141.259,47.884,137.666,46.477,134.364,45.579);
				scissors.bezierCurveTo(132.495,44.455,130.463,43.327,128.179,42.243);
				scissors.bezierCurveTo(118.236,37.52,110.589,33.462,110.589,33.462);
				scissors.lineTo(104.298,48.858);
				scissors.lineTo(116.761,54.034);
				scissors.bezierCurveTo(112.446,66.485,118.664,80.229,131.043,85.092);
				scissors.bezierCurveTo(143.739,90.08,158.075,83.829,163.065,71.134);
				scissors.bezierCurveTo(164.316,67.947,164.605,65.308,164.139,63.058);
				scissors.closePath();
				scissors.moveTo(157.098,68.787);
				scissors.bezierCurveTo(153.41,78.174,142.774,82.808,133.388,79.123);
				scissors.bezierCurveTo(131.176,78.255,129.193,76.995,127.491,75.379);
				scissors.bezierCurveTo(122.055,70.225,120.313,62.387,123.053,55.413);
				scissors.bezierCurveTo(125.238,49.855,127.171,49.239,142.725,55.349);
				scissors.bezierCurveTo(148.463,57.603,153.88,59.732,156.499,62.217);
				scissors.bezierCurveTo(157.532,63.196,158.816,64.413,157.098,68.787);
				scissors.closePath();
				scissors.beginFill("#d8dadb");
				scissors.moveTo(69.55,35.129);
				scissors.lineTo(96.525,28.489);
				scissors.lineTo(97.623,28.91);
				scissors.lineTo(69.55,35.129);
				scissors.closePath();
				scissors.beginFill("#231f20");
				scissors.moveTo(95.51,44.567);
				scissors.lineTo(122.081,39.295);
				scissors.lineTo(125.907,41.157);
				scissors.lineTo(95.51,44.567);
				scissors.closePath();
				scissors.beginFill("#d54c3d");
				scissors.moveTo(165.653,22.873);
				scissors.bezierCurveTo(164.645,9.27,152.797,-0.941,139.194,0.068);
				scissors.bezierCurveTo(125.932,1.052,115.923,12.341,116.364,25.513);
				scissors.lineTo(102.929,26.771);
				scissors.lineTo(104.384,43.337);
				scissors.bezierCurveTo(104.384,43.337,112.889,41.723,123.784,40.15);
				scissors.bezierCurveTo(126.286,39.79,128.559,39.315,130.679,38.793);
				scissors.bezierCurveTo(134.099,38.913,137.949,38.633,142.033,38.329);
				scissors.bezierCurveTo(151.641,37.615,159.958,36.979,163.662,31.88);
				scissors.bezierCurveTo(163.912,31.576,164.118,31.248,164.291,30.9);
				scissors.bezierCurveTo(165.403,28.895,165.908,26.285,165.653,22.873);
				scissors.closePath();
				scissors.moveTo(156.744,29.448);
				scissors.bezierCurveTo(153.508,31.048,147.704,31.479,141.557,31.935);
				scissors.bezierCurveTo(124.892,33.171,123.225,32.01,122.783,26.056);
				scissors.bezierCurveTo(122.228,18.584,126.21,11.611,132.927,8.294);
				scissors.bezierCurveTo(135.031,7.255,137.301,6.638,139.667,6.462);
				scissors.bezierCurveTo(149.726,5.717,158.513,13.29,159.262,23.349);
				scissors.bezierCurveTo(159.609,28.035,158.021,28.817,156.744,29.448);
				scissors.closePath();
				scissors.name = 'scissors';
				addToStage(scissors);
				return scissors;
			break;
		}
	}
	
	return {
		set		: setWeapon,
		get		: getWeapon,
		remove	: removeWeapon
	};
}());

function jumpOutScene() {
	theirs.getContainer().x += 20;
	theirs.getContainer().y -= 10.6;
	if (theirs.getContainer().y < -200) {
		jumpOut = false;
	}
}

function tick() {
	var yours = critterApp.yours();
	
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(yours.getContainer());
		if (jiggle) jiggle = false;
		var randInt = Math.round(Math.random()*40);
		if (randInt === 4 || randInt === 3 || randInt === 2 || randInt === 1) {
			if(!jiggle) jiggle = true;
		}
	}
	
	if (theirs && theirs.getArms()) {
			
		animateArms(theirs.getContainer());
		
		if (theirs.getContainer().x > 100 && !jumpOut) theirs.getContainer().x -= 10;
		
		if (theirs.getContainer().y < theirs.getContainer().targetY && !jumpOut) theirs.getContainer().y += 10.6;
		
		if (Math.round(Math.random()*40) === 4) {
			animateEyes(theirs.getContainer());
			if (jiggleTheirs) jiggleTheirs = false;
			var randInt2 = Math.round(Math.random()*40);
			if (randInt2 === 4 || randInt2 === 3 || randInt2 === 2 || randInt2 === 1) {
				if(!jiggleTheirs) jiggleTheirs = true;
			}
		}
	}
		
	if (yours.getContainer().x < 100) yours.getContainer().x += 10;
		
	if (yours.getContainer().y < yours.getContainer().targetY) yours.getContainer().y += 10.6;
	
	if (critterApp.yours()) animateArms(yours.getContainer());

	if (hugFriend) hug(yours.getContainer());
	
	if (rps.get() !== null) {
		var index = critterApp.yourStage().children.length - 1;
		//can be fairly certain it was the last thing added		
		if (critterApp.yourStage().children[index].name === 'rock') {
			critterApp.yourStage().children[index].y = yours.getArms().children[0]._matrix.ty + 80;
		} else if (critterApp.yourStage().children[index].name === 'paper') {
			critterApp.yourStage().children[index].y = yours.getArms().children[0]._matrix.ty + 55;
		} else {
			critterApp.yourStage().children[index].y = yours.getArms().children[0]._matrix.ty + 50;
		}
	}
	
	if (change) kill(yours.getContainer());
	
	if (jumpOut) jumpOutScene();
	
	critterApp.yourStage().update();
	if (critterApp.theirStage()) critterApp.theirStage().update(); 
}
