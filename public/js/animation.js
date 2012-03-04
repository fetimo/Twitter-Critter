function animateEyes(critter) {
	var eyeAnimations = [0,1], //array of available functions
		waitTime = Math.round(2000+(Math.random()*(8000-2000))),
		pupils = critter.children[1].children[1];

	/* actual animations */
	function leftToRight() {
		if (pupils.x < 3) {
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
	
	var animate = Math.round(Math.random()*eyeAnimations.length); //grab a random animation
	//check which animation will be played
	if (animate === 0 || animate === 1) {
		leftToRight();
	} else if (animate === 2) {
		upDown();
	}
}

function tick() {
	//only animate some of the time
	if (Math.round(Math.random()*40) === 4) { //http://xkcd.com/221/
		animateEyes(critter_container);
	} 
	try {
		//critter_container2 === undefined isn't working in Safari so resorted to try/catch
		if (critter_container2 && Math.round(Math.random()*40) === 4) {
			animateEyes(critter_container2);
		}
	} catch(e) {
	}
	stage.update();
	friend_stage.update();
}