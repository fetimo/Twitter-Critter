// Get a reference to the element.
var	critter_container = new Container();
//var critter_container2 = new Container();

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
							break;
							case 'eye_colour':
								var eyes = new Container,
									socket = new Bitmap('../images/critter_assets/eyes/base_eyes.png'),
									pupils = new Bitmap('../images/critter_assets/eyes/'+ critter[key] + '.png');
								eyes.addChild(socket, pupils);
							break;
							case 'eye_shape':
							break;
							case 'neck':
							break;
							case 'legs':
								var legs = new Bitmap('../images/critter_assets/legs/'+ critter[key] + '.png');
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
								var hair_length = new Bitmap('../images/critter_assets/hair_length/'+ critter[key] + '.png');
							break;
							case 'body_colour':
								var body = new Bitmap('../images/critter_assets/bodies/simple.png');
								var colour = critter[key];
								$(body.image).load(function() {
									setColour(colour, body)
								});
								//body.image.onload = setColour(critter[key], body);
								//body.image.id = 'body';
								//body.onload = loadHandler();
							break;
							case 'body_weight':
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
					if (colour === 'green') {
						var filter = new ColorFilter(.58,.79,.16,1); //divide rgb value by 255 to get these values
					} else if (colour === 'blue') {
						var filter = new ColorFilter(.18,.62,.84,1);
					} else if (colour === 'black') {
						var filter = new ColorFilter(.1,.1,.13,1);
					} else if (colour === 'white') {
						var filter = new ColorFilter(1,1,1,1);
					} else if (colour === 'red') {
						var filter = new ColorFilter(.65,.04,.04,1);
					} else if (colour === 'pink') {
						var filter = new ColorFilter(.79,.09,.44,1);
					} else if (colour === 'yellow') {
						var filter = new ColorFilter(.9,.72,.26,1);
					} else {
						var filter = new ColorFilter(1,1,1,1);
					}
					body.filters = [filter];
					body.cache(0, 0, body.image.width, body.image.height);
					
					position();
				}
					
				function position() {
					//position elements
					eyes.x = body.image.width/2 -35;
					eyes.y = 60;
					eyes.children[1].regY = 5;
					if(critter_container.children.length > 0) {
						//first container is populated so must have to fill second
						critter_container2.addChild(body, eyes);
						critter_container2.x = critter_container2.children.length*200;
					} else critter_container.addChild(body, eyes);
					
					
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