// Required libraries
var UI = require('ui');
var Vector2 = require('vector2');

var Endpoint = {
// Endpoint object
    create: function (x, y) {
		var circle = new UI.Circle({
			  position: new Vector2(x, y),
			  radius: 1.5,
			  backgroundColor: 'blue',
			});
//			console.log("Coords: " + circle.position().x + ", " + circle.position().y);
		return circle;
    },
};

module.exports = Endpoint;
