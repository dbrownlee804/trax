/*
 * Tr@x - a breadcrumb GPS program for your Pebble Time.
 */

// Need a 2 pixel buffer around the edges, to give dimensions of x:3->142, y:3->150 

// Required Pebble.js libraries
var UI = require('ui'); // automatically includes all sub-files
var Vector2 = require('vector2');
// Trax libraries to include
var Endpoint = require('endpoint');
var TraxUtil = require('traxutil');
var SampleData = require('sampledata');
// Include the USNG Geolocation library
var USNG = require('usng');

// An ID to store to later clear the watch from sending watchPosition() callbacks
var watchId;

// Holds all geo data as Endpoints
var allPoints = new Array();

// Resolution definition (update every x meters distance moved)
var granularity = 100;//13; //100; //25; //(25 for production, 0 or 1 is good for inside apartment testing.  10 is good for outdoor testing (maybe 5 would reduce the walking...) ) In meters.
//25 works well

// Pebble frame dimensions, in pixels, based on a 144 * 168 UI.Window.
var border = 2;
var pebbleFrameXoffset = border;
var pebbleFrameYoffset = 25 + border; //provides a border of at least 2 on the edges.
var pebbleFrameX = 144 - 2 * border;
var pebbleFrameY = 168 - pebbleFrameYoffset * 2 + 10; //100; // adding 10 allows to run into the bottom text areas without interference.

// Format of requested geographical position
var geoOptions = {
		  enableHighAccuracy: true,
		  maximumAge: 30000,
		  timeout: 10000
		};

//Set the mode: graphic or digit
var displayMode = "graphics";
//var displayMode = "digits";

// Set the background for graphics mode
var wind = new UI.Window({
	fullscreen: true,
//	style:,
//	scrollable:,
	backgroundColor:'kellyGreen'
});

// Set the background, for digits mode
var card = new UI.Card({
	  title: 'TRAX',
	  scrollable: true,
	  body: ""
	});


// Main page display definition
// Definition of the current grid location, to be displayed in a title bar.
var currentGridTitle = new UI.Text({ position: new Vector2(0, 0),
	size: new Vector2(144, pebbleFrameYoffset - border),
	borderColor: "black",
	backgroundColor: "yellow",
	text: "",
	font: 'gothic-18-bold',
	color: "black",
	textoverflow: "fill",
	textalign: "center"
});


// Tr@x logo in bottom left of screen.
var branding = new UI.Text({
	position: new Vector2(2, 147), //just where it looks good.
	size: new Vector2(50, pebbleFrameYoffset - border),
//		borderColor: "black",
	backgroundColor: "clear",
	text: 'TR@X',
	font: 'gothic-18-bold',
	color: "black",
	textoverflow: "fill",
	textalign: "left"
});

// Current time, in bottom right of screen.
var timeText = new UI.TimeText({
	position: new Vector2(106, 147), // bottom right corner
	size: new Vector2(40, pebbleFrameYoffset - border),
//		borderColor: "black",
	backgroundColor: "clear",
	text: "%H:%M",
	font: 'gothic-18-bold',
	color: "black",
	textoverflow: "fill",
	textalign: "right"
});

// Large dot on current position
var dot = new UI.Circle({
	radius: 4,
	borderColor: "black",
	backgroundColor: 'yellow'
});

//Large dot on start position
var startDot = new UI.Circle({
	radius: 3,
	borderColor: "red",
	backgroundColor: 'red'
});


//main application function
//Either display coords as graphics, or display as digits
if (displayMode == "graphics"){
	
//	TraxUtil.clearGeoData();
//		TraxUtil.consoleGeoData();
	
	// Pick a data set
//	var allPoints = SampleData.smallDogLeg;
//	var allPoints = SampleData.extremes;
//	SampleData.populateSimpleSet();
//	SampleData.populateSmallUSNGDogLeg();
//	SampleData.populateSmallestUSNGDogLeg();
//	SampleData.populateSmallOddPath();
//	SampleData.populateReturnSchoolTrip();
//	SampleData.populateWednesdayRunHomeToGadbois();
	//		TraxUtil.consoleGeoData();

	//Display main graphic window
	wind.show();
	redrawWind();
	watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);	
		
} else if(displayMode == "digits") {
	// Do the stuff for digits display
//	TraxUtil.clearGeoData();
	card.show();
	watchId = navigator.geolocation.watchPosition(digitsGeoSuccess, geoError, geoOptions);	

}
// End of main application		

/*
 * EVENT HANDLING
 */
//Clear when select button pressed (digits mode)
card.on('click', 'select', function() {
	console.log('Select clicked! LocalStorage cleared!');
	TraxUtil.clearGeoData();
	card.body("");
//	printAllFromStorage();
	printDigits(here); // For running coord
});

// Present menu in graphics mode.
wind.on('click', 'select', function(e) {
	// Display the starting and current USNG Grids
	var geoData = TraxUtil.getGeoData();
	var startGrid = geoData.shift();
	var currentGrid = geoData.pop();
	
	var menu = new UI.Menu({
		sections: [{
			items: [{
				title: 'Starting position',
				subtitle: startGrid
			}, {
				title: 'Current position',
				subtitle: currentGrid
			}, {
				title: 'Clear',
//	        	icon: 'images/garbageCan.png',
				subtitle: 'Erase Trax and exit'
			}]
		}],
		fullscreen: true, //false,
	  	backgroundColor: "yellow",
	  	highlightBackgroundColor: "kellyGreen",
	  	highlightTextColor: "black"
	});
	menu.on('select', function(e) {
		//Clear data and restart
		if (e.itemIndex == 2) {
			TraxUtil.clearGeoData();
	    	setTimeout(function(){}, 500); //just pause for enough time to clear memory
	    	wind.hide();
	    	menu.hide();
	    }
	});
		menu.show();
});

/*
 * Many helper functions, used throughout.
 * 
 */

//Extract Easting from USNG coordinate
function extractEasting(USNGCoord) {
//	console.log("E: " + USNGCoord.substring(7,12));
	return USNGCoord.substring(7,12);
}

//Extract Northing from USNG coordinate
function extractNorthing(USNGCoord) {
	return USNGCoord.substring(13, 18);
}

// Convert Cartesian coords (quadrant I) to Pebble coords (quadrant IV)
// Zeroizes to x-axis, as a side effect.
function allPointsToPebbleCoordOrientation() {
	var maxNorthing = getMaxNorthingFromAllPoints();
	for (var i = 0; i < allPoints.length; i++) {
		allPoints[i] = Endpoint.create(allPoints[i].position().x, Math.abs(allPoints[i].position().y - maxNorthing));
	}
//	console.log("(" + point.position().x + ", " + point.position().y + ")");
}

//Find the least Northing in the allPoints array of Endpoints
function getMinNorthingFromAllPoints() {
	var minNorthing = 100000;
	for (var i = 0; i < allPoints.length; i++) {
		if (allPoints[i].position().y < minNorthing){
			minNorthing = allPoints[i].position().y;
		}
	}
	return minNorthing;
}

// Find the greatest Northing in the allPoints array of Endpoints
function getMaxNorthingFromAllPoints() {
	var maxNorthing = 0;
	for (var i = 0; i < allPoints.length; i++) {
		if (allPoints[i].position().y > maxNorthing){
			maxNorthing = allPoints[i].position().y;
		}
	}
	return maxNorthing;
}

// Find the least Easting in the allPoints array of Endpoints.
function getMinEastingFromAllPoints() {
	var minEasting = 100000;
	for (var i = 0; i < allPoints.length; i++) {
		if (allPoints[i].position().x < minEasting){
			minEasting = allPoints[i].position().x;
		}
	}
	return minEasting;
}

// Fing the greatest Easting in the allPoints array of Endpoints
function getMaxEastingFromAllPoints() {
	var maxEasting = 0;
	for (var i = 0; i < allPoints.length; i++) {
		if (allPoints[i].position().x > maxEasting){
			maxEasting = allPoints[i].position().x;
		}
	}
	return maxEasting;
}

// Zeroize to y-axis.
function allPointsZeroizeYAxis() {
	var minEasting = getMinEastingFromAllPoints();
	for (var i = 0; i < allPoints.length; i++) {
		allPoints[i] = Endpoint.create(allPoints[i].position().x - minEasting, allPoints[i].position().y);
	}
}

// Determine scaling factor to apply
// Scale allPoints to Pebble frame size.
function scaleAllPointsToPebbleFrame() {
	// Max range of geoData, already zeroized in x and y.
	var maxEasting = getMaxEastingFromAllPoints();
	var maxNorthing = getMaxNorthingFromAllPoints();
	
	// Scale factors.
	var scaleX = 0, scaleY = 0, scaleToApply = 0;
	
	scaleX = pebbleFrameX / maxEasting;
	scaleY = pebbleFrameY / maxNorthing;
	
	// Find the minimum of the possible stretch factors
	scaleToApply = (scaleX < scaleY) ? scaleX : scaleY;
	
	// Apply stretch factor to allPoints, in both x and y directions
	for (var i = 0; i < allPoints.length; i++) {
		allPoints[i] = Endpoint.create(allPoints[i].position().x * scaleToApply, allPoints[i].position().y * scaleToApply);
	}
}

// Center the path in the display frame area.  Coords are already X and Y zeroized.
function centerAllPointsInPebbleFrame() {
	// Dimensions of the display frame are previously declared.
	
	// Consists of a translation towards the center, plus offsets for the border.
	var maxEasting = getMaxEastingFromAllPoints();
	var maxNorthing = getMaxNorthingFromAllPoints();
	
	// Calculate the centering translations - one of these will be 1 because allPoints is already scaled to the Pebble frame dimensions
	var translateX = (pebbleFrameX - maxEasting) / 2;
	var translateY = (pebbleFrameY - maxNorthing) / 2;
	
	// Shift towards the center and apply the offsets.
	for (var i = 0; i < allPoints.length; i++) {
		allPoints[i] = Endpoint.create(allPoints[i].position().x + translateX + pebbleFrameXoffset,
				allPoints[i].position().y + translateY + pebbleFrameYoffset);
	}
}

// Populates the allPoints array of Endpoints used for drawing with the USNG geoData from persistent storage.
function fillAllPointsWithGeoData() {
	var geoData = TraxUtil.getGeoData();
	for (var i = 0; i < geoData.length; i++) {
		allPoints[i] = Endpoint.create(parseInt(extractEasting(geoData[i]), 10), parseInt(extractNorthing(geoData[i]), 10));
	}
}

// Print the allPoints array to console logger.  Used only for testing.
function consoleAllPoints() {
	console.log("Begin allPoints:...");
	for (var i = 0; i < allPoints.length; i++) {
	console.log("[" + allPoints[i].position().x + ", " + allPoints[i].position().y + "]");
	}
}

// If phone successfully sends a new GPS location
function geoSuccess(pos) {
	// Find current location, in USNG coordinates
	var here = USNG.LLtoUSNG(pos.coords.latitude, pos.coords.longitude, 5); // 5 digits, therefore 1 meter precision.

	// Only process new coord if outside the granularity threshold...
	if (displacementFromLastStoredCoord(here) >= granularity) {
		TraxUtil.pushGeoData(here);
		redrawWind();
	}
}

function digitsGeoSuccess(pos) {
	// Find current location, in USNG coordinates
	var here = USNG.LLtoUSNG(pos.coords.latitude, pos.coords.longitude, 5); // 5 digits, therefore 1 meter precision.

	// Only process new coord if outside the granularity threshold...
	if (displacementFromLastStoredCoord(here) >= granularity) {
		TraxUtil.pushGeoData(here);
		
//		TraxUtil.consoleGeoData();  // For console logging and testing purposes...
		printDigits(here); // For running coord
//		printAllFromStorage(); // For accumulated coords.
	}
}

//If phone fails to send a new GPS location
function geoError(err) {
	  console.log('location error (' + err.code + '): ' + err.message);
	  // You just don't get a reading.  No problem.
	}

//Displacement since last USNG reading
function displacementFromLastStoredCoord(USNG){
	// Find last coord
	var geoData = TraxUtil.getGeoData();
	var previousEasting, previousNorthing;

	var hereEasting = extractEasting(USNG);
	var hereNorthing = extractNorthing(USNG);
	
	// If first coordinate, default to 0, just for somewhere to start
	if (geoData.length == 0) {
		previousEasting = 0;
		previousNorthing = 0;
	} else {
		//get most recent Coord
		var lastCoord = geoData.pop();
		previousEasting = lastCoord.substring(7, 12);
		previousNorthing = lastCoord.substring(13);
	}
	
	// Calculate displacement since last reading
	var deltaEasting = previousEasting - hereEasting;
	var deltaNorthing = previousNorthing - hereNorthing;
	
	// Calculate absolute displacement
	var displacement = Math.sqrt(deltaEasting * deltaEasting + deltaNorthing * deltaNorthing);
	
	return displacement;
}


function redrawWind(){
	// Clear window.
	for (var i = 0; i <= 25 ; i++){ // No idea why it must be done multiple times...  The iterator doesn't seem to work...
		wind.each(function(element) {
			wind.remove(element);
		});
	}
	// Reset the window with usual display sections.
	wind.add(currentGridTitle);
	wind.add(branding);
	wind.add(timeText);
	drawPath();
}	



//TESTING FUNCTIONS

//Display coords on watch screen with timestamp, mostly for testing of granularity...
function printDigits(USNGcoord) {
	// Timestamp
	card.body(card.body() + Math.round( (Date.now() / 1000) % 5000 ) + ': ' ); //- 1459626165) ); //83 minute timer.
	card.body(card.body() + USNGcoord.substring(9,12) + " ");
	card.body(card.body() + USNGcoord.substring(15, 18) + "\n");

	// Console Logger
//	console.log("Stamp:" + Math.round( (Date.now() / 1000) % 5000 ) + ": "); //- 1459626165) ); //1000 seconds for a 16 min, 40 sec timer.
//	console.log(USNGcoord.substring(9,12) + " " + USNGcoord.substring(15, 18));
}

//Display all saved coords on the watch screen to ensure tracking
function printAllFromStorage() {
	card.body("");
	var geoArray = TraxUtil.getGeoData(); 
	for (var i = 0; i < geoArray.length; i++){
		var coord = geoArray[i];
//		console.log("Printing from[" + i + "]: " + coord);
		card.body(card.body() + coord.substring(9, 12) + " ");
		card.body(card.body() + coord.substring(15, 18) + "\n");
	}
}

//Draw a line as a linear interpolation between two Endpoints
//var line = function (start, end) {
function line(start, end) {
	// Total number of pixels needed to draw a continuous line between the start and end points
	var pix = 1 / ( Math.abs(start.position().x - end.position().x) > Math.abs(start.position().y - end.position().y) ? 
			Math.abs(start.position().x - end.position().x) : Math.abs(start.position().y - end.position().y) );
	
	// 1 for a continuous line between endPoints, otherwise draw dotted with n breaks between pixels.
	var dottingFactor = 8;//2;

	// Linear interpolation
	for (var pixels = pix; pixels < 1; pixels += dottingFactor * pix) {
		var segment = new UI.Rect({size: new Vector2(1, 1), backgroundColor: 'red', 
			position: new Vector2(start.position().x + (end.position().x - start.position().x) * pixels,
					start.position().y + (end.position().y - start.position().y) * pixels)});
		wind.add(segment);
	}

//  Draw start and end Endpoint Circles on top in drawing
	wind.add(start);
	wind.add(end);
}

function drawPath() {
	//Move USNG data to allPoints array to apply calculations
	fillAllPointsWithGeoData();
	
	// Apply transformation sequence
	allPointsToPebbleCoordOrientation();
	allPointsZeroizeYAxis();
	scaleAllPointsToPebbleFrame();
	centerAllPointsInPebbleFrame()

	// Connect all points
	// Place endpoints in an array and draw the array...
	for (var i = 1; i < allPoints.length; i++){
		line(allPoints[i-1], allPoints[i]);
	}
	
	// Last position in allPoints array
	// Handle an empty array...
	if (allPoints.length > 0) {
		// Mark start position with a red dot.
		startPosition = new Vector2(allPoints[0].position().x, allPoints[0].position().y);
		startDot.position(startPosition);
		wind.add(startDot);
		
		// Mark current (end) position with a yellow dot.
		currentPosition = new Vector2(allPoints[allPoints.length - 1].position().x, allPoints[allPoints.length - 1].position().y);
		dot.position(currentPosition);
		wind.add(dot);
	}

	// Display the last USNG Grid
	var geoData = TraxUtil.getGeoData();
	var currentGrid = geoData.pop();
	if (currentGrid === undefined) {
		currentGridTitle.text(" Go!");
	} else {
		currentGridTitle.text(" " + currentGrid);  // better for spacing with the space...
	}
}


