// Get a reference to the element.
var	critter_container = new Container();

function build(crit) {
	// Always check for properties and methods, to make sure your code doesn't break in other browsers.
	if (elem && elem.getContext) {
		// Remember: you can only initialize one context per element.	
		var context = elem.getContext('2d');
		
		if (context) {
			function process() {
				//var critter_container = new Container();
				var critter = crit.attributes;
				for (var key in critter) {
					if (critter.hasOwnProperty(key)) {
						switch (key) {
							case 'arms':
								var arms = new Bitmap('../images/critter_assets/arms/'+ critter[key] + '.png');
								arms.image.name = critter[key];
							break;
							case 'eye_colour':
								var eyes = new Container,
									socket = new Bitmap('../images/critter_assets/eyes/base_eyes.png'),
									pupils = new Bitmap('../images/critter_assets/eyes/'+ critter[key] + '.png');
								$(pupils.image).load(function() {
									
								});			
								eyes.addChild(socket, pupils);					
							break;
							case 'body':
								if (critter[key] !== 'plain') {
									var pattern = new Bitmap('../images/critter_assets/body_patterns/'+ critter[key] + '.png');
									$(pattern.image).load(function() {
										//wait for image to load before continuing
									});
								}
							break;
							case 'nose':
								if (critter[key] !== 'none') {
									var nose = new Bitmap('../images/critter_assets/noses/'+ critter[key] + '.png');
									$(nose.image).load(function() {
										//wait for image to load before continuing
									});
								}
							break;
							case 'legs':
								var legs = new Bitmap('../images/critter_assets/legs/'+ critter[key] + '.png');
								$(legs.image).load(function() {
									//wait for image to load before continuing
								});
							break;
							case 'ears':
								if (critter[key] !== 'none') {
									var ears = new Bitmap('../images/critter_assets/ears/'+ critter[key] + '.png');
								}
							break;
							case 'face':
								if (critter[key] !== 'none') {
									var face = new Bitmap('../images/critter_assets/face/'+ critter[key] + '.png');
								}
							break;
							case 'mouth':
								var mouth = new Bitmap('../images/critter_assets/mouths/'+ critter[key] + '.png');
							break;
							case 'hands':
								if (critter[key] !== 'none') {
									var hands = new Bitmap('../images/critter_assets/hands/'+ critter[key] + '.png');
								}
							break;
							case 'body_colour':
								var body = new Container(),
									colour = critter[key];
							break;
							case 'body_type':
								var body_shape = new Bitmap('../images/critter_assets/bodies/'+ critter[key] + '.png');
								body_shape.name = critter[key];
								body.addChild(body_shape);
								$(body.children[0].image).load(function() {									
									setColour(colour, body_shape)
								});
							break;
							case 'accessory':
								if (critter[key] !== 'none') {
									var accessory = new Bitmap('../images/critter_assets/accessory/'+ critter[key] + '.png');
								}
							break;
						}
					}
				}
								
				function setColour(colour, body) {
					var filter;
					if (colour === 'green') {
						filter = new ColorFilter(.58,.79,.16,1); //divide rgb value by 255 to get these values
					} else if (colour === 'blue') {
						filter = new ColorFilter(.18,.62,.84,1);
					} else if (colour === 'black') {
						filter = new ColorFilter(.9,.619,.156,1);
					} else if (colour === 'white') {
						filter = new ColorFilter(.9,.9,.9,1);
					} else if (colour === 'red') {
						filter = new ColorFilter(.65,.04,.04,1);
					} else if (colour === 'pink') {
						filter = new ColorFilter(.83,.556,.839,1);
					} else if (colour === 'yellow') {
						filter = new ColorFilter(.882,.769,.345,1);
					} else if (colour === 'orange') {
						filter = new ColorFilter(.91,.62,.157,1);
					} else {
						filter = new ColorFilter(1,1,1,1);
					}
					body.filters = [filter];
					arms.filters = [filter];
					legs.filters = [filter];
					if (accessory) accessory.filters = [filter];
					body.cache(0, 0, body.image.width, body.image.height);
					arms.cache(0, 0, arms.image.width, arms.image.height);
					legs.cache(0, 0, legs.image.width, legs.image.height);
					if (accessory) accessory.cache(0, 0, accessory.image.width, accessory.image.height);
					
					//eyelids
					var	r = Math.round(filter.redMultiplier * 255)-20,
						g = Math.round(filter.greenMultiplier * 255)-20,
						b = Math.round(filter.blueMultiplier * 255)-20,
						eyelid = new Graphics();
					eyelid.moveTo(0,0);
					eyelid.lineTo(52,0);
					eyelid.lineTo(52,71);
					eyelid.lineTo(0,71);
					eyelid.closePath();
					eyelid.setStrokeStyle(1, 0, 0, 4);
					eyelid.beginFill(Graphics.getRGB(r,g,b));
					eyelid.moveTo(52,35);
					eyelid.bezierCurveTo(52, 55, 45, 71, 26, 71);
					eyelid.bezierCurveTo(6, 71,0, 55, 0, 35);
					eyelid.bezierCurveTo(0, 15, 6, 0, 26, 0);
					eyelid.bezierCurveTo(45, 0, 52, 15, 52, 35);
					var el = new Shape(eyelid);
					el.scaleX = 1.45;
					el.scaleY = 1.45;
					el.alpha = 0;
					//clone eyelid to make a second
					var el2 = el.clone();
					el2.x += 105;		
					eyes.addChild(el,el2);
				
					position();
				}
					
				function position() {				
					//position elements
					critter_container.y = 30;
					eyes.x = Math.round(body.children[0].image.width/4);
					eyes.y = 60;
					eyes.children[1].regY = 5;
					legs.x = 70;
					legs.y = 230;
					arms.x = -95;
					arms.y = -100;
					mouth.x = eyes.x - 10;
					mouth.y = 220;
					
					
																		
					if (nose) {
						nose.y = -70;
						nose.x = -50;
					}
					if (pattern) {
						pattern.x = -96;
						pattern.y = -102;
						body.addChild(pattern);
					}
					if (face) {
						face.x = -50;
						face.y = -80;
					}
					if (accessory) {
						accessory.x = 120; //-96
						accessory.y = 60; //-100
					}
					if (body.children[0].name === 'furry') {
						// special positions for furry critters
						body.y = -50;
						body.x = -50;
						if (pattern) {
							pattern.x = 0;
							pattern.y = 0;
						}
						eyes.y = 80;
						eyes.x -= 20;
						legs.x += 30;
						if (arms.image.name === 'long') {
							arms.x += 50;
							arms.y = -60;
						} else if (arms.image.name === 'short') {
							arms.x += 50;
						}
						if (accessory) {
							accessory.y += 50;
							accessory.x += 46;
						}
					}
					if (critter_container.children.length > 0) {
						//first container is populated so must have to fill second
						critter_container2.y = 30;
						critter_container2.addChild(legs, body, eyes, arms);
						if (face) critter_container2.addChild(face);
						if (nose) critter_container2.addChild(nose);
						if (mouth) critter_container2.addChild(mouth);
						if (ears) critter_container2.addChild(ears);
						if (accessory) critter_container2.addChild(accessory);
						critter_container2.x = 400;
					} else {
						critter_container.x = 30;
						critter_container.addChild(legs, body, eyes, arms);
						if (face) critter_container.addChild(face);
						if (nose) critter_container.addChild(nose);
						if (mouth) critter_container.addChild(mouth);
						if (ears) critter_container.addChild(ears);
						if (accessory) critter_container.addChild(accessory);
					}
					
					if (stage.children.length === 0) {
						stage.addChild(critter_container);
						//stage.update();
					} else {
						//their critter
						friend_stage.addChild(critter_container2);
						//friend_stage.update();
					}
					
					Ticker.addListener(window);
					Ticker.setFPS(20);	
				}
			}
			function getAttributes() {
				crit.get('uid') === undefined ? _.delay(getAttributes, 100) : process();
			}
			getAttributes();
		}
	}
	//your_critter.save(); sends POST request to crittr.me/critters/username
}