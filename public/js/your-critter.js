function build(crit) {
	// Get a reference to the element.
	var elem = document.getElementById('your-critter');
	// Always check for properties and methods, to make sure your code doesn't break in other browsers.
	if (elem && elem.getContext) {
		// Get the 2d context.
		// Remember: you can only initialize one context per element.
		var context = elem.getContext('2d');
		if (context) {		
			function display() {
			    function clearCanvas(context, canvas) {
					context.clearRect(0, 0, canvas.width, canvas.height);
					var w = canvas.width;
					canvas.width = 1;
					canvas.width = w;
					context.font         = '20px sans-serif';
					context.textBaseline = 'top';
					context.fillText  ('Your critter', 0, 10);
				}
			    
			    clearCanvas(context,elem);		   
			    	            
	            var critter = crit.attributes;
	            ySpace = 39;
	            for (var key in critter) {
					if (critter.hasOwnProperty(key)) {
						switch (key) {
							case 'name':
								context.fillText (('is called ' + critter[key] + ','), 0, ySpace);
								ySpace += 30;
							break;
							case 'arms':
								context.fillText (('it has ' + critter[key] + ' arms'), 0, ySpace);
								ySpace += 30;
							break;
							case 'eye_colour':
								var text = 'and ' + critter[key] + ' eyes';
								context.fillText (text, 0, ySpace);
								textWidth = context.measureText('sans-serif', 20, text);
								ySpace += 30;
							break;
							case 'eye_shape':
								context.fillText ((' which are ' + critter[key] + ','), textWidth.width+50, 99);
							break;
							case 'neck':
								context.fillText (('a ' + critter[key] + ' neck,'), 0, ySpace);
								ySpace += 30;
							break;
							case 'legs':
								context.fillText ((critter[key] + ' legs,'), 0, ySpace);
								ySpace += 30;
							break;
							case 'face':
								critter[key] === 'horns' || critter[key] === 'glasses' || critter[key] === 'freckles' ? context.fillText (('a face with ' + critter[key] + ','), 0, ySpace) : context.fillText (('a face with a ' + critter[key] + ','), 0, ySpace);
								ySpace += 30;
							break;
							case 'hands':
								critter[key] === 'simple' ? context.fillText (('hands which are ' + critter[key] + ','), 0, ySpace) : context.fillText (('hands with ' + critter[key] + ','), 0, ySpace);
								ySpace += 30;
							break;
							case 'hair_colour':
								context.fillText ((critter[key] + ' hair'), 0, ySpace);
								ySpace += 30;
							break;
							case 'hair_length':
								context.fillText (('which is ' + critter[key] + ','), 100, 249);
							break;
							case 'body_colour':
								context.fillText (('a ' + critter[key] + ' body'), 0, ySpace);
								ySpace += 30;
							break;
							case 'body_weight':
								context.fillText (('which is ' + critter[key]), 120, 279);
							break;
							case 'body_tail':
								if (critter[key] != 'none') {
									context.fillText (('with a ' + critter[key]), 0, ySpace);
									ySpace += 30;
								}
							break;
							case 'accessory':
								if (critter[key] != 'none') {
									critter[key] == 'shell' ? context.fillText (('and a ' + critter[key] + '.'), 0, ySpace) : context.fillText (('which is ' + critter[key] + '.'), 0, ySpace);
									ySpace += 30;
								}
							break;
							
						}
					}
				}
			}
			function getAttributes() {				
				crit.get('uid') === undefined ? _.delay(getAttributes, 100) : display();
			}
			getAttributes();
		}
	}
	//your_critter.save(); sends POST request to crittr.me/critters/username
}