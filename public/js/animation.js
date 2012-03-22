function animateEyes(critter) {
		
	var eyeAnimations = [0,1,2], //array of available functions
		waitTime = Math.round(2000+(Math.random()*(8000-2000)));
		//pupils = critter.children[2].children[1];
	
	//need to change this so we're not using a for loop _every_ frame	
	for (var i=0; i < critter.children.length; i+=1) { 
		if (critter.children[i].name && critter.children[i].name.substr(0,4) === 'eyes') {
			var eyes = critter.children[i];
			var pupils = eyes.children[1];
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

var theirs;
function tick() {
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(critter.getContainer());
	}
	if (theirs && theirs.getStage() && Math.round(Math.random()*40) === 4) {
		animateEyes(theirs.getContainer());
	}
	try { friend_stage.x = 470; } catch(e) {}
	//animateArms(critter_container);
	stage.update();
	try { friend_stage.update(); } catch(e) {}
}