/* __TODO__
 *
 * * Make it OO to allow multiple Critters on the same page
 *
 */

var canvas,
	stage;

(function() {
	canvas = document.getElementById('your-critter');
	stage = new Stage(canvas);
		
	for(var i = 2; i -= 1;) {
	
		/* loading limb images */
		var body = new Bitmap('../images/test.png'),
			head = new Bitmap('../images/head.png'),
			leftArm = new Bitmap('../images/arm.png'),
			rightArm = new Bitmap('../images/arm.png');
		
		/* positioning */
		body.y = head.image.height - 25;
		body.x = leftArm.image.width - 22;
		
		//position arms just below the start of the body
		leftArm.y = body.y + 15;
		rightArm.y = leftArm.y;
	
		//rightArm is the leftArm's width plus the width of the body
		rightArm.x = leftArm.image.width + body.image.width;
		
		//flips arm
		rightArm.scaleX = -1;
		rightArm.scaleY = 1;
		
		//finds the middle of the body and puts the head on top of it
		head.regX = head.image.width/2;
		head.x = body.image.width/2 + body.x;
		
		/* setup the Critter */
		critter = new Container();
		critter.addChild(leftArm, rightArm, body, head);
	
		stage.addChild(critter);
		stage.update();
	}
	
	console.log(critter);
	
	Ticker.addListener(window);
	Ticker.setFPS(40);
	//critter.setTransform(100,200)
})();

function tick() {
	//critter.x += .1;
	//critter.y += 1;
//	critter.rotation += 20;
	// draw the updates to stage
	stage.update();
}