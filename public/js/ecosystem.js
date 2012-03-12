function build(crit) {
	critter_container = new Container();	
	// Always check for properties and methods, to make sure your code doesn't break in other browsers.
	if (elem && elem.getContext) {
		// Remember: you can only initialize one context per element.	
		var context = elem.getContext('2d');
		
		if (context) {
			function process() {
				var critter = crit.attributes;		            
	            for (var key in critter) {
					if (critter.hasOwnProperty(key)) {
						switch (key) {
							case 'name':
								var critter_name = new Text(critter[key], '70px Aller Light', '#000');
							break;
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
								var pattern = new Bitmap('../images/critter_assets/body_patterns/'+ critter[key] + '.png');
								$(pattern.image).load(function() {
									//wait for image to load before continuing
								});
							break;
							case 'nose':
								var nose = new Bitmap('../images/critter_assets/noses/'+ critter[key] + '.png');
								$(nose.image).load(function() {
									//wait for image to load before continuing
								});
							break;
							case 'legs':
								var legs = new Bitmap('../images/critter_assets/legs/'+ critter[key] + '.png');
								$(legs.image).load(function() {
									//wait for image to load before continuing
								});
							break;
							case 'ears':
								var ears = new Bitmap('../images/critter_assets/ears/'+ critter[key] + '.png');
							break;
							case 'face':
								var face = new Bitmap('../images/critter_assets/face/'+ critter[key] + '.png');
							break;
							case 'mouth':
								var mouth = new Bitmap('../images/critter_assets/mouth/'+ critter[key] + '.png');
							break;
							case 'hands':
								var hands = new Bitmap('../images/critter_assets/hands/'+ critter[key] + '.png');
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
								if (critter[key] != 'none') {
									var accessory = new Bitmap('../images/critter_assets/ears/'+ critter[key] + '.png');
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
					eyelid.lineTo(52.343,0);
					eyelid.lineTo(52.343,71.038);
					eyelid.lineTo(0,71.038);
					eyelid.closePath();
					eyelid.setStrokeStyle(1, 0, 0, 4);
					eyelid.beginFill(Graphics.getRGB(r,g,b));
					eyelid.moveTo(52.343,35.519);
					eyelid.bezierCurveTo(52.343, 55.138,45.787, 71.039, 26.172, 71.039);
					eyelid.bezierCurveTo(6.556,71.038,0,55.138,0,35.519);
					eyelid.bezierCurveTo(0,15.903,6.556,0,26.172,0);
					eyelid.bezierCurveTo(45.787,0,52.343,15.903,52.343,35.519);
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
					legs.x = 90;
					legs.y = 230;
					arms.x = -95;
					arms.y = -100;
					critter_name.x = 400;
					critter_name.y = 100;
					critter_name.maxWidth = 700;
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
						face.x = -90;
						face.y = -100;
					}
					if (accessory) {
						accessory.x = -96;
						accessory.y = -100;
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
						legs.x += 30;
						if (arms.image.name === 'short') {
							arms.x += 50;
							arms.y = -60;
						} else if (arms.image.name === 'long') {
							arms.x += 100;
						}
						if (accessory) {
							accessory.y += 50;
							accessory.x += 46;
						}
					}
					critter_container.x = 30;
					critter_container.addChild(legs, body, eyes, arms);
					if (face) critter_container.addChild(face);
					if (nose) critter_container.addChild(nose);
					if (ears) critter_container.addChild(ears);
					if (accessory) critter_container.addChild(accessory);
					
					stage.addChild(critter_container, critter_name);					
					stage.update();
					
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
}
// Get a reference to the element.
var	critter_container = new Container();
/*
	Setup Critter model, url defaults to the username requested
*/
var Critter = Backbone.Model.extend({
	initialize: function () {
		this.url = 'js/latest_critter.json';
		this.fetch();
	}
});

var	your_critter = new Critter(),
	elem = document.getElementById('your-critter'),
	stage = new Stage(elem);

setInterval(function() {
	your_critter.fetch();
}, 1000);

your_critter.on('change', function() {
	stage.removeAllChildren();
	stage.update();
	build(your_critter);
});