function animateEyes(critter) {
	var eyeAnimations = [0,1,2], //array of available functions
		waitTime = Math.round(2000+(Math.random()*(8000-2000))),
		pupils = critter.children[2].children[1];
	
	/*
	//this makes the small black eyes move, but it doesn't look very good
	if (pupils.parent.name === 'small_black') {
		pupils = pupils.parent;
	}*/
	/* actual animations */
	function leftToRight() {
		if (pupils.x <= 3) {
			pupils.x += Math.round(Math.random()*3.5);
		} else {
			setTimeout(function() { pupils.x -= 3 }, waitTime);
		}
	}
	
	function upDown() {
		if (pupils.y < 3) {
			pupils.y += Math.round(Math.random()*4);
		} else { 
			setTimeout(function() { pupils.y -= 3 }, waitTime);
		}
	}
	
	function blink() {
		var el = critter.children[2].children[2],
			el2 = critter.children[2].children[3];
		el.alpha = 1;
		el2.alpha = 1;
		function clearBlink(el,el2) {
			el.alpha = 0;
			el2.alpha = 0;
		}
		var blinkTime = Math.round(99+(Math.random()*(100))); //blinking lasts between 200 to 300ms
		_.delay(clearBlink, blinkTime, el, el2);
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

/*function animateArms(critter) {
	arms = critter.children[3];
	if (arms.children[0].skewX > -50) arms.children[0].skewX -= 2;
	if (arms.children[0].skewY > -50) arms.children[0].skewY -= 2;
	//if (arms.children[1].skewX < -40) arms.children[1].skewX -= 1;
	//if (arms.children[1].skewY < -40) arms.children[1].skewY -= 1;

	arms.cache(0, 0, 450, 400);
}*/

function tick() {
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(critter_container);
	} 
	try {
		if (critter_container2 && Math.round(Math.random()*40) === 4) {
			animateEyes(critter_container2);
		}
		friend_stage.update();
	} catch(e) {}
	//animateArms(critter_container);
	stage.update();
}