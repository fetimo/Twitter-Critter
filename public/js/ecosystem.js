// Get a reference to the element.
var elem = document.getElementById('ecosystem');

// Always check for properties and methods, to make sure your code doesn't break in other browsers.
if (elem && elem.getContext) {
	// Get the 2d context.
	// Remember: you can only initialize one context per element.
	var context = elem.getContext('2d');
	
	if (context) {
		(function call() {

			var httpRequest;
			makeRequest('js/latest_critter.json');			
			window.setTimeout(call, 3000);
			
			function makeRequest() {
			    if(window.XMLHttpRequest) {
			        httpRequest = new XMLHttpRequest();
			    } else if (window.ActiveXObject) {
			        try {
			            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			        } catch (e) {
			            try {
			                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			            } catch (e) {}
			        }
			    }
			    if(!httpRequest) {
			        return false;
			    }
			    httpRequest.onreadystatechange = display;
			    httpRequest.open('GET', 'js/latest_critter.json', false);
			    httpRequest.send(null);
			}
			
			function display() {
			    
			    
			    if(httpRequest.readyState === 4) {
				    if (httpRequest.status === 200) {
			        	clearCanvas(context,elem);

			            var critter = JSON.parse(httpRequest.responseText);
			            ySpace = 70;
			            
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
										context.fillText ((' which are ' + critter[key] + ','), textWidth.width+50, 130);
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
										context.fillText (('a face with a ' + critter[key] + ','), 0, ySpace);
										ySpace += 30;
									break;
									case 'hands':
										context.fillText (('hands with ' + critter[key] + ','), 0, ySpace);
										ySpace += 30;
									break;
									case 'hair_colour':
										context.fillText ((critter[key] + ' hair'), 0, ySpace);
										ySpace += 30;
									break;
									case 'hair_length':
										context.fillText (('which is ' + critter[key] + ','), 100, 280);
									break;
									case 'body_colour':
										context.fillText (('a ' + critter[key] + ' body'), 0, ySpace);
										ySpace += 30;
									break;
									case 'body_weight':
										context.fillText (('which is ' + critter[key]), 120, 310);
									break;
									case 'body_tail':
										if (critter[key] != 'none') {
											context.fillText (('with a ' + critter[key]), 0, ySpace);
											ySpace += 30;
										}
									break;
									case 'accessory':
										if (critter[key] != 'none') {
											critter[key] == 'shell' ? context.fillText (('with a ' + critter[key] + '.'), 0, ySpace) : context.fillText (('which is ' + critter[key] + '.'), 0, ySpace);
											ySpace += 30;
										}
									break;
								}
							}
						}
					}
			    }
			}
			
			function clearCanvas(context, canvas) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				var w = canvas.width;
				canvas.width = 1;
				canvas.width = w;
				context.font         = '20px sans-serif';
				context.textBaseline = 'top';
				context.fillText  ('The latest critter', 0, 40);
			}
		})();
	}
}