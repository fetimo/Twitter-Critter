var theirs,
	wave = 0,
	oscillate = true,
	arms;

function getAttributes() {
	if (critterApp.yours().getArms() === undefined) {
		_.delay(getAttributes, 300)
	} else {
		arms = critterApp.yours().getArms();
		if (arms.name === 'arms short') {
			arms.cache(0, 0, 450, 400);
		} else {
			//long arms require caching a larger portion of the canvas
			arms.cache(-300, -400, 750, 538);
		}
	}
}

getAttributes();

function animateEyes(critter) {
		
	var eyeAnimations = [0,1,2], //array of available functions
		waitTime = Math.round(2000+(Math.random()*(8000-2000)));
	
	//need to change this so we're not using a for loop _every_ frame	
	for (var i=0; i < critter.children.length; i+=1) { 
		if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'eyes') {
			var eyes = critter.children[i],
				pupils = eyes.children[1];
			break;
		}
	}
	
	/*
	//this makes the small black eyes move, but it doesn't look very good
	if (pupils.parent.name === 'small_black') {
		pupils = pupils.parent;
	}*/
	
	/* actual animations */
	function leftToRight() {
		try {
			if (pupils.x <= 3) {
				pupils.x += Math.round(Math.random()*3.5);
			} else {
				setTimeout(function() { pupils.x -= 3 }, waitTime);
			}
		} catch(e) {}
	}
	
	function upDown() {
		try {
			if (pupils.y < 3) {
				pupils.y += Math.round(Math.random()*4);
			} else { 
				setTimeout(function() { pupils.y -= 3 }, waitTime);
			}
		} catch(e) {}
	}
	
	function blink() {
		try {
			var el = eyes.children[2],
				el2 = eyes.children[3];
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

function animateArms(critter) {
	if (arms) {
		if (wave <= 2) {
			if (arms.children[0].scaleY > -1) arms.children[0].scaleY -= .4;
			if (oscillate) {
				arms.children[0].rotation += 5;
				if (arms.children[0].rotation > 60) { oscillate = false; wave += 1}
			} else if (!oscillate){
				arms.children[0].rotation -= 5;
				if (arms.children[0].rotation <= 0) { oscillate = true; }
			}
		} else {
			if (arms.children[0].scaleY < 1) arms.children[0].scaleY += .5;
			if (arms.children[0].rotation > 0) arms.children[0].rotation -= 5;
		}
		arms.uncache();
	}
}

function tick() {
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(critterApp.yours().getContainer());
	}
	if (theirs && theirs.getStage() && Math.round(Math.random()*40) === 4) {
		animateEyes(theirs.getContainer());
	}
	animateArms(critterApp.yours());
	
	critterApp.yourStage().update();
	if (critterApp.theirStage()) critterApp.theirStage().update(); 
}