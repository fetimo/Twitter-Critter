var wave = 0,
	rub = 0,
	oscillate = true,
	oscillateHug = true,
	oscillateTheirs = true,
	hugFriend = false,
	jiggle = false,
	jiggleTheirs = false,
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
				el.alpha = 1;
				el2.alpha = 1;
				function clearBlink(el,el2) {
					el.alpha = 0;
					el2.alpha = 0;
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
			if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'arms') {
				var arms = critter.children[i];
				break;
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

function animateArms(critter) {
		
	for (var i=0; i < critter.children.length; i+=1) { 
		if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'arms') {
			var arms = critter.children[i];
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
		if (jiggle && !hugFriend && critter.id === 7) {			
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

function tick() {
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(critterApp.yours().getContainer());
		if (jiggle) jiggle = false;
		var randInt = Math.round(Math.random()*40);
		if (randInt === 4 || randInt === 3 || randInt === 2 || randInt === 1) {
			if(!jiggle) jiggle = true;
		}
	}
	
	if (theirs && theirs.getArms()) {
			
		animateArms(theirs.getContainer());
		
		if (Math.round(Math.random()*40) === 4) {
			animateEyes(theirs.getContainer());
			if (jiggleTheirs) jiggleTheirs = false;
			var randInt2 = Math.round(Math.random()*40);
			if (randInt2 === 4 || randInt2 === 3 || randInt2 === 2 || randInt2 === 1) {
				if(!jiggleTheirs) jiggleTheirs = true;
			}
		}
	}
	
	if (critterApp.yours()) animateArms(critterApp.yours().getContainer());
	
	if (hugFriend) hug(critterApp.yours().getContainer());
	
	critterApp.yourStage().update();
	if (critterApp.theirStage()) critterApp.theirStage().update(); 
}