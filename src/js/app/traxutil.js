var traxutil = {};


// Utility functions for manipulating localStorage

//Stores a USNG coord in persistent storage
// Function to store array as geoData string in localStorage
traxutil.pushGeoData = function(USNGCoord) {
	//confirm valid USNGCoord format.
	var geoArray = this.getGeoData();
		geoArray.push(USNGCoord);
//		console.log("pushing: " + USNG);
	localStorage.setItem("geoData", geoArray.join(","));
}

// Returns the geographical data array from persistent storage as a zero-indexed array
traxutil.getGeoData = function() {
	var geoArray = localStorage.getItem("geoData");
	if (geoArray !== null){
//		console.log("geoArray:" + geoArray.split(",").toString());
		return geoArray.split(",");
	} else {
		var empty = []; // empty array
		return empty;
	}
}

// Clears all geographical data from persistemt storage
traxutil.clearGeoData = function() {
	localStorage.removeItem("geoData");
//	console.log("geoData clear");
	var geoArray = this.getGeoData();
//	console.log("geoArray:" + geoArray.toString());

}

// Output geographical data to console logger.  Used for debugging
traxutil.consoleGeoData = function() {
	var geoArray = this.getGeoData();
//	console.log("geoArray length: " + geoArray.length);
	//handle the null case
	if (geoArray == null) {
		console.log("geoData empty");
	} else {
		for (var i = 0; i < geoArray.length; i++) {
			console.log("geoData[" + i + "]: " + geoArray[i]);
		}
	}
}

module.exports = traxutil;
