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
							case 'eye_shape':
								var pattern = new Bitmap('../images/critter_assets/body_patterns/'+ critter[key] + '.png');
								$(pattern.image).load(function() {
									//wait for image to load before continuing
								});
							break;
							case 'neck':
								if(critter[key] === 'long') {
									var nose = new Bitmap('../images/critter_assets/noses/button.png');
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
							case 'face':
								var face = new Bitmap('../images/critter_assets/face/'+ critter[key] + '.png');
							break;
							case 'hands':
								var hands = new Bitmap('../images/critter_assets/hands/'+ critter[key] + '.png');
							break;
							case 'hair_colour':
								var hair_colour = new Bitmap('../images/critter_assets/hair_colour/'+ critter[key] + '.png');
							break;
							case 'hair_length':
								if (critter[key] === 'fat' || critter[key] === 'thin') {
									var ears = new Bitmap('../images/critter_assets/ears/'+ critter[key] + '.png');
								}
							break;
							case 'body_colour':
								var body = new Container(),
									colour = critter[key];
							break;
							case 'body_weight':
								if (critter[key] === 'fat' || critter[key] === 'thin') {
									var body_shape = new Bitmap('../images/critter_assets/bodies/furry.png');
								} else {
									var body_shape = new Bitmap('../images/critter_assets/bodies/simple.png');
								}
								
								body_shape.name = critter[key];
								body.addChild(body_shape);
								$(body.children[0].image).load(function() {									
									setColour(colour, body_shape)
								});
							break;
							case 'body_tail':
								if (critter[key] != 'none') {
									var body_tail = new Bitmap('../images/critter_assets/body_tail/'+ critter[key] + '.png');
								}
							break;
							case 'accessory':
								if (critter[key] != 'none') {
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
						filter = new ColorFilter(.9,.72,.26,1);
					} else {
						filter = new ColorFilter(1,1,1,1);
					}
					body.filters = [filter];
					arms.filters = [filter];
					legs.filters = [filter];
					body.cache(0, 0, body.image.width, body.image.height);
					arms.cache(0, 0, arms.image.width, arms.image.height);
					legs.cache(0, 0, legs.image.width, legs.image.height);
					position();
				}
					
				function position() {				
					//position elements
					eyes.x = Math.round(body.children[0].image.width/4);
					eyes.y = 60;
					eyes.children[1].regY = 5;
					legs.x = 90;
					legs.y = 230;
					arms.x = -95;
					arms.y = -100;
					if (nose) {
						nose.y = -90;
						nose.x = -80;
					}
					if (pattern) {
						pattern.x = -96;
						pattern.y = -102;
						body.addChild(pattern);
					}
					if (body.children[0].name !== 'medium') {
						// special positions for furry critters
						body.y = -50;
						body.x = -50;
						if (pattern) {
							pattern.x = 0;
							pattern.y = 0;
						}
						eyes.y = 80;
						eyes.x -= 20;
						if (arms.image.name === 'hairy') {
							arms.x += 50;
							arms.y = -60;
						}
					}
					if (critter_container.children.length > 0) {
						//first container is populated so must have to fill second
						critter_container2.addChild(legs, body, eyes, arms);
						if (nose) {
							critter_container2.addChild(nose);
						}
						if (ears) {
							critter_container.addChild(ears);
						}
						critter_container2.x = 400;
					} else {
						critter_container.x = 30;
						critter_container.addChild(legs, body, eyes, arms);
						if (nose) {
							critter_container.addChild(nose);
						}
						if (ears) {
							critter_container.addChild(ears);
						}
					}
					
					if (stage.children.length === 0) {
						stage.addChild(critter_container);
						stage.update();
					} else {
						//their critter
						friend_stage.addChild(critter_container2);
						friend_stage.update();
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