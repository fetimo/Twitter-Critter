// Get a reference to the element.
var	critter_container = new Container(),
	critter_container2;

function build(crit) {
	// Always check for properties and methods, to make sure your code doesn't break in other browsers.
	if (elem && elem.getContext) {
		// Remember: you can only initialize one context per element.	
		var context = elem.getContext('2d');
		
		if (context) {
			function process() {
				var critter = crit.attributes,
					totalImages = 0,
					loaded = 0;
								
				/*
					This function takes an unlimited amount of arguments
					and for each image it receives, adds it to the totalImages
					variable and then adds an onload function.
					
					We then check if the loaded images is equal to the
					number of images and continue processing the Critter.
				*/
				function preload() {					
					var args = arguments;
					totalImages += args.length;
					if (typeof args === 'object') {
						for (var i=0; i < args.length; i+=1) {
							var image = args[i];
							image.onload = function() {
								loaded += 1;
							}
						}
					}
					if (loaded < totalImages) {
						_.delay(preload, 500);
					} else if (loaded === totalImages && colour !== undefined && body_shape !== undefined) {
						setColour(colour, body_shape);
					}
				}
				
				for (var key in critter) {
					if (critter.hasOwnProperty(key)) {					
						switch (key) {
							case 'arms':
								var arms = new Image();
								arms.src = '../images/critter_assets/arms/'+ critter[key] + '.png';
								
								var arms = new Bitmap('../images/critter_assets/arms/'+ critter[key] + '.png');
								var armG = new Graphics();
								if (critter[key] === 'short') {									
									armG.moveTo(0,0);
									armG.lineTo(82.801,0);
									armG.lineTo(82.801,92.375);
									armG.lineTo(0,92.375);
									armG.closePath();
									armG.setStrokeStyle(1, 0, 0, 4);
									armG.beginFill("#ffffff");
									armG.moveTo(4.083,53.282);
									armG.bezierCurveTo(-15.346,75.961,40.222,107.476,52.372,84.193);
									armG.bezierCurveTo(52.385,84.169,81.1,30.538,81.1,30.538);
									armG.bezierCurveTo(84.89,24.61,82.127,16.063,74.921,11.453);
									armG.lineTo(65.382,2.87);
									armG.bezierCurveTo(58.174,-1.745,49.255,-0.68,45.461,5.246);
									armG.bezierCurveTo(45.461,5.246,4.198,53.147,4.083,53.282);
									armG.closePath();
									var arms = new Container();
									var armL = new Shape(armG);
									armL.x = 50;
									armL.y = 300;
									var armR = armL.clone();
									armR.x += 400;
									armR.rotation = 180;
									armR.skewX = 180;
									arms.addChild(armL, armR);
								}
								arms.name = critter[key];
								//preload(arms.image);
							break;
							case 'eye_colour':
								var eyes = new Container,
									pupils = new Bitmap('../images/critter_assets/eyes/'+ critter[key] + '.png');
								eyes.name = critter[key];
								if(critter[key] !== 'small_black') {
									var socket = new Bitmap('../images/critter_assets/eyes/base_eyes.png');
									eyes.addChild(socket, pupils);
									preload(pupils.image, socket.image);
								} else {
									eyes.addChild(pupils);
									preload(pupils.image);
								}				
							break;
							case 'body':
								if (critter[key] !== 'plain') {
									var pattern = new Bitmap('../images/critter_assets/body_patterns/'+ critter[key] + '.png');
									preload(pattern.image);
								}
							break;
							case 'nose':
								if (critter[key] !== 'none') {
									var nose = new Bitmap('../images/critter_assets/noses/'+ critter[key] + '.png');
									preload(nose.image);
								}
							break;
							case 'legs':
								var legs = new Bitmap('../images/critter_assets/legs/'+ critter[key] + '.png');
								legs.name = critter[key];
								preload(legs.image);
							break;
							case 'ears':
								//if (critter[key] !== 'none' || critter[key] !== 'floppy') {
								if (critter[key] === 'mouse') {
									var ears = new Bitmap('../images/critter_assets/ears/'+ critter[key] + '.png');
									preload(ears.image);
								}
							break;
							case 'face':
								if (critter[key] !== 'none' && !nose) {
									var face = new Bitmap('../images/critter_assets/face/'+ critter[key] + '.png');
									preload(face.image);
								}
							break;
							case 'mouth':
								if (critter[key] === 'fangs') {
									var mouth = new Bitmap('../images/critter_assets/mouths/'+ critter[key] + '.png');
									mouth.name = critter[key];
									preload(mouth.image);
								} else {
									var mouthG = new Graphics();
									mouthG.moveTo(0,0);
									mouthG.lineTo(169,0);
									mouthG.lineTo(169,13);
									mouthG.lineTo(0,13);
									mouthG.closePath();
									mouthG.setStrokeStyle(1, 0, 0, 4);
									mouthG.beginFill("#000100");
									mouthG.moveTo(0,0);
									mouthG.bezierCurveTo(0,0,16.077,3.867,37.974,4.199);
									mouthG.bezierCurveTo(50.398,4.388,64.697,3.439,78.995,0);
									mouthG.bezierCurveTo(78.995,0,43.495,13.75,0,0);
									mouthG.closePath();
									var mouth = new Shape(mouthG);
									mouth.alpha = 0.5;
									mouth.scaleX = 2.127311405661921;
									mouth.scaleY = 2.127311405661921;
								}
							break;
							case 'hands':
								/*if (critter[key] !== 'none') {
									var hands = new Bitmap('../images/critter_assets/hands/'+ critter[key] + '.png');
									preload(hands.image);
								}*/
							break;
							case 'body_colour':
								var body = new Container(),
									colour = critter[key];
							break;
							case 'body_type':
								var body_shape = new Bitmap('../images/critter_assets/bodies/'+ critter[key] + '.png');
								body_shape.name = critter[key];
								body.addChild(body_shape);
								preload(body_shape.image);
							break;
							case 'accessory':
								if (critter[key] !== 'none') {
									var accessory = new Bitmap('../images/critter_assets/accessory/'+ critter[key] + '.png');
									accessory.name = critter[key];
									preload(accessory.image);
								}
							break;
						}								
					}
				}
												
				function setColour(colour, body) {
					var filter;
					switch(colour) {
						case 'green':
							filter = new ColorFilter(.58,.79,.16,1); //divide rgb value by 255 to get these values
						break;
						case 'blue':
							filter = new ColorFilter(.18,.62,.84,1);
						break;
						case 'black':
							filter = new ColorFilter(.9,.619,.156,1);
						break;
						case 'white':
							filter = new ColorFilter(.9,.9,.9,1);
						break;
						case 'red':
							//filter = new ColorFilter(.65,.04,.04,1);
							filter = new ColorFilter(.85,.33,.3,1);
						break;
						case 'pink':
							filter = new ColorFilter(.83,.556,.839,1);
						break;
						case 'yellow':
							filter = new ColorFilter(.882,.769,.345,1);
						break;
						case 'orange':
							filter = new ColorFilter(.91,.62,.157,1);
						break;
						default:
							filter = new ColorFilter(1,1,1,1);
						break;
					}
					body.filters = [filter];
					arms.filters = [filter];
					legs.filters = [filter];
					if (accessory && accessory.name === 'tail') accessory.filters = [filter];
					if (ears) ears.filters = [filter];
					body.cache(0, 0, body.image.width, body.image.height);
					arms.cache(0, 0, 450, 400);
					legs.cache(0, 0, legs.image.width, legs.image.height);
					if (accessory && accessory.name === 'tail') accessory.cache(0, 0, accessory.image.width, accessory.image.height);
					if (ears) ears.cache(0, 0, ears.image.width, ears.image.height);
					
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
					if (eyes.name !== 'small_black') {
						el.scaleX = 1.45;
						el.scaleY = 1.45;
					} else {
						el.scaleX = .62;
						el.scaleY = .62;
					}
					el.alpha = 0;
					//clone eyelid to make a second
					var el2 = el.clone();
					eyes.name !== 'small_black' ? el2.x += 105 : el2.x += 56;
					eyes.addChild(el,el2);
					
					var shadow = new Shadow('rgb('+r+','+g+','+b+')', 0 , 4 , 0);
					arms.shadow = shadow;
					position();
				}
					
				function position() {				
					//position elements
					if (eyes.name !== 'small_black') {
						eyes.x = Math.round(body.children[0].image.width/5);
						eyes.y = 60;
						eyes.children[1].regY = 5;
					} else {
						eyes.x = Math.round(body.children[0].image.width/3);
						eyes.y = 60;
						eyes.children[1].regY = 5;
					}
					legs.x = 70;
					legs.y = 230;
					arms.x = -95;
					arms.y = -100;
					if (nose) {
						nose.y = -70;
						nose.x = -50;
						if (eyes.name === 'small_black') nose.y = -10; 
					}
					mouth.x = Math.round(eyes.children[0].image.width/2) - 15;
					mouth.y = 220;
					if (mouth.name === 'fangs') {
						mouth.y += 10;
					}
					if (eyes.name === 'small_black') {
						mouth.x += -30;
						mouth.y += -20;
					}
					if (pattern) {
						pattern.x = -96;
						pattern.y = -102;
						body.addChild(pattern);
					}
					if (face) {
						face.x = -Math.round(eyes.children[0].image.width/2);
						face.y = -80;
						if (eyes.name === 'small_black') face.y = -130;
					}
					if (accessory && accessory.name === 'horns') {
						accessory.x = -100;
						accessory.y = -100;
					} else if (accessory) {
						//accessory is tail
						accessory.x = 46;
						accessory.y = 180;
						accessory.rotation = -36.2;
					}
					if (ears) {
						ears.x = -95;
						ears.y = -102;
					}
					if (body.children[0].name === 'furry') {
						// special positions for furry critters
						body.y = -50;
						body.x = -50;
						if (pattern) {
							pattern.x = 0;
							pattern.y = 0;
						}
						mouth.x = Math.round(eyes.children[0].image.width/2) + 20;
						eyes.y = 80;
						legs.x += 30;
						if (legs.name === 'short') legs.y += 60;
						if (arms.name === 'long') {
							arms.x += 50;
							arms.y = -60;
						} else if (arms.name === 'short') {
							arms.x += 50;
						}
						if (accessory) {
							accessory.y += 50;
							accessory.x += 46;
						}
						if (ears) {
							ears.x = -45;
							ears.y = -48;
						}
						if (face) {
							face.x = Math.round(-eyes.children[0].image.width/3);
							face.y = -eyes.children[0].image.height + 25;
						}
						if (nose) {
							nose.x = Math.round(-eyes.children[0].image.width/3);
							nose.y = -eyes.children[0].image.height + 25;
							if (eyes.name === 'small_black') nose.y = -10;
						}
					}
					if (critter_container2 === undefined) {
						critter_container.y = 30;
						critter_container.x = 30;
						if (legs.name === 'short') {
							critter_container.y = 30;
							if (body.children[0].name === 'simple') {
								critter_container.y += 65;
							}
						}
						critter_container.addChild(legs, body, eyes, arms);
						if (face) critter_container.addChild(face);
						if (nose) critter_container.addChild(nose);
						if (mouth) critter_container.addChild(mouth);
						if (ears) critter_container.addChild(ears);
						if (accessory) critter_container.addChild(accessory);
					} else {
						//first container is populated so must have to fill second
						critter_container2.y = 30;
						if (legs.name === 'short') {
							critter_container.y = 30;
							if (body.children[0].name === 'simple') {
								critter_container2.y += 65;
							}
						}
						critter_container2.addChild(legs, body, eyes, arms);
						if (face) critter_container2.addChild(face);
						if (nose) critter_container2.addChild(nose);
						if (mouth) critter_container2.addChild(mouth);
						if (ears) critter_container2.addChild(ears);
						if (accessory) critter_container2.addChild(accessory);
						critter_container2.x = critter_container.x + 400;
					}
					
					if (!stage.children.length) {
						stage.addChild(critter_container);
					} else if (critter_container2) {
						//their critter
						friend_stage.addChild(critter_container2);
					}
					Ticker.addListener(window);
					Ticker.setFPS(20);
					$('.loader').fadeOut(100, function() {
						$('.loader').css('display', 'none');
					});
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