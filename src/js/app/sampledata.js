var Vector2 = require('vector2');
var Endpoint = require('endpoint');
var TraxUtil = require('traxutil');

var SampleData = {
	// Loop path
	loop : new Array(new Endpoint.create(15, 150),
		new Endpoint.create(15, 137),
		new Endpoint.create(16, 122),
		new Endpoint.create(17, 113),
		new Endpoint.create(19, 101),
		new Endpoint.create(23, 81),
		new Endpoint.create(31, 72),
		new Endpoint.create(43, 50),
		new Endpoint.create(65, 33),
		new Endpoint.create(83, 22),
		new Endpoint.create(98, 17),
		new Endpoint.create(110, 15),
		new Endpoint.create(130, 23),
		new Endpoint.create(125, 40),
		new Endpoint.create(115, 63),
		new Endpoint.create(103, 82),
		new Endpoint.create(91, 95),
		new Endpoint.create(80, 108),
		new Endpoint.create(79, 116),
		new Endpoint.create(75, 128),
		new Endpoint.create(63, 136),
		new Endpoint.create(48, 142),
		new Endpoint.create(36, 147)
	),
		
	// Extreme edges and corners of viewable area
	extremes : new Array(new Endpoint.create(135, 125),
		new Endpoint.create(10, 152),
		new Endpoint.create(1, 12),
		new Endpoint.create(144, 1),
		new Endpoint.create(70, 80)
	),
	
	smallDogLeg : new Array(Endpoint.create(20, 20),
		new Endpoint.create(20, 120),
		new Endpoint.create(60, 120),
		new Endpoint.create(60, 90)
	),
	
	// Minimal USNG data set.
	populateSimpleSet : function() {
//		TraxUtil.clearGeoData();
		// Beginning of Souvenir to ETS walk, 100m granularity
		TraxUtil.pushGeoData("18T XR 10910 38144");
		TraxUtil.pushGeoData("18T XR 10938 38240");
		TraxUtil.pushGeoData("18T XR 11001 38319");
		TraxUtil.pushGeoData("18T XR 11073 38390");

	},

	populateSmallUSNGDogLeg : function() {
//		TraxUtil.clearGeoData();
		// draw a cross on the screen, for testing...
		TraxUtil.pushGeoData("18T XR 10500 38500");
		TraxUtil.pushGeoData("18T XR 10500 38800");
		TraxUtil.pushGeoData("18T XR 10700 38800");
		TraxUtil.pushGeoData("18T XR 10700 38700");
	},
	
	populateSmallestUSNGDogLeg : function() {
		TraxUtil.pushGeoData("18T XR 00020 00020");
		TraxUtil.pushGeoData("18T XR 00020 00120");
		TraxUtil.pushGeoData("18T XR 00060 00120");
		TraxUtil.pushGeoData("18T XR 00060 00090");
	},
	
	populateSmallOddPath : function() {
		TraxUtil.pushGeoData("18T XR 00040 00020");
		TraxUtil.pushGeoData("18T XR 00040 00060");
		TraxUtil.pushGeoData("18T XR 00020 00060");
		TraxUtil.pushGeoData("18T XR 00020 00090");
		TraxUtil.pushGeoData("18T XR 00080 00090");
		TraxUtil.pushGeoData("18T XR 00080 00120");
		TraxUtil.pushGeoData("18T XR 00100 00120");
		TraxUtil.pushGeoData("18T XR 00100 00080");
		TraxUtil.pushGeoData("18T XR 00080 00080");
		TraxUtil.pushGeoData("18T XR 00080 00070");
		TraxUtil.pushGeoData("18T XR 00060 00070");
		TraxUtil.pushGeoData("18T XR 00060 00050");
	},
	
	populateReturnSchoolTrip : function() {
		TraxUtil.pushGeoData("18T XR 12186 38777");  // ETS
		TraxUtil.pushGeoData("18T XR 12086 38766");
		TraxUtil.pushGeoData("18T XR 11996 38816");
		TraxUtil.pushGeoData("18T XR 11914 38876");
		TraxUtil.pushGeoData("18T XR 11828 38932");
		TraxUtil.pushGeoData("18T XR 11769 39018");
		TraxUtil.pushGeoData("18T XR 11670 39034");
		TraxUtil.pushGeoData("18T XR 11570 39005");
		TraxUtil.pushGeoData("18T XR 11464 38963");
		TraxUtil.pushGeoData("18T XR 11420 38852");
		TraxUtil.pushGeoData("18T XR 11360 38769");
		TraxUtil.pushGeoData("18T XR 11300 38686");
		TraxUtil.pushGeoData("18T XR 11268 38580");
		TraxUtil.pushGeoData("18T XR 11167 38599");
		TraxUtil.pushGeoData("18T XR 11165 38478");
		TraxUtil.pushGeoData("18T XR 11172 38590");
		TraxUtil.pushGeoData("18T XR 11156 38478");
		TraxUtil.pushGeoData("18T XR 11174 38600");
		TraxUtil.pushGeoData("18T XR 11155 38478");
		TraxUtil.pushGeoData("18T XR 11169 38603");
		TraxUtil.pushGeoData("18T XR 11153 38469");
		TraxUtil.pushGeoData("18T XR 11167 38605");
		TraxUtil.pushGeoData("18T XR 11143 38459");
		TraxUtil.pushGeoData("18T XR 11169 38605");
		TraxUtil.pushGeoData("18T XR 11073 38390");
		TraxUtil.pushGeoData("18T XR 11001 38319");
		TraxUtil.pushGeoData("18T XR 10938 38240");
		TraxUtil.pushGeoData("18T XR 10910 38144"); // du Souvenir
		TraxUtil.pushGeoData("18T XR 10903 38136");
		TraxUtil.pushGeoData("18T XR 10828 38204");
		TraxUtil.pushGeoData("18T XR 10736 38164");
		TraxUtil.pushGeoData("18T XR 10646 38220");
		TraxUtil.pushGeoData("18T XR 10545 38304");
		TraxUtil.pushGeoData("18T XR 10646 38330");
		TraxUtil.pushGeoData("18T XR 10718 38401");
		TraxUtil.pushGeoData("18T XR 10783 38502");
		TraxUtil.pushGeoData("18T XR 10855 38578");
		TraxUtil.pushGeoData("18T XR 10928 38654");
		TraxUtil.pushGeoData("18T XR 10984 38739");
		TraxUtil.pushGeoData("18T XR 11051 38817");
		TraxUtil.pushGeoData("18T XR 11088 38920");
		TraxUtil.pushGeoData("18T XR 11146 39006");
		TraxUtil.pushGeoData("18T XR 11229 39063");
		TraxUtil.pushGeoData("18T XR 11274 39153");
		TraxUtil.pushGeoData("18T XR 11333 39236");
		TraxUtil.pushGeoData("18T XR 11417 39169");
		TraxUtil.pushGeoData("18T XR 11514 39130");
		TraxUtil.pushGeoData("18T XR 11610 39088");
		TraxUtil.pushGeoData("18T XR 11699 39027");
		TraxUtil.pushGeoData("18T XR 11783 38965");
		TraxUtil.pushGeoData("18T XR 11865 38902");
		TraxUtil.pushGeoData("18T XR 11950 38848");
		TraxUtil.pushGeoData("18T XR 12033 38786");
		TraxUtil.pushGeoData("18T XR 12145 38763");
		TraxUtil.pushGeoData("18T XR 12224 38832");  // ETS
	},
	
	populateWednesdayRunHomeToGadbois : function() {
		TraxUtil.pushGeoData("18T XR 10700 38148"); // home
		TraxUtil.pushGeoData("18T XR 10609 38096");
		TraxUtil.pushGeoData("18T XR 10534 38025");
		TraxUtil.pushGeoData("18T XR 10465 37951");
		TraxUtil.pushGeoData("18T XR 10393 37879");
		TraxUtil.pushGeoData("18T XR 10334 37794");
		TraxUtil.pushGeoData("18T XR 10246 37739");
		TraxUtil.pushGeoData("18T XR 10180 37661");
		TraxUtil.pushGeoData("18T XR 10118 37582");
		TraxUtil.pushGeoData("18T XR 10039 37511");
		TraxUtil.pushGeoData("18T XR 09966 37434");
		TraxUtil.pushGeoData("18T XR 09906 37354");
		TraxUtil.pushGeoData("18T XR 09845 37251");
		TraxUtil.pushGeoData("18T XR 09767 37181");
		TraxUtil.pushGeoData("18T XR 09713 37094");
		TraxUtil.pushGeoData("18T XR 09655 37010");
		TraxUtil.pushGeoData("18T XR 09637 36908");
		TraxUtil.pushGeoData("18T XR 09708 36837");
		TraxUtil.pushGeoData("18T XR 09798 36788");
		TraxUtil.pushGeoData("18T XR 09900 36711");
		TraxUtil.pushGeoData("18T XR 09812 36660");
		TraxUtil.pushGeoData("18T XR 09818 36558");
		TraxUtil.pushGeoData("18T XR 09753 36473");
		TraxUtil.pushGeoData("18T XR 09885 36308");
		TraxUtil.pushGeoData("18T XR 09985 36298");
		TraxUtil.pushGeoData("18T XR 09985 36198");
		TraxUtil.pushGeoData("18T XR 09964 36095");
		TraxUtil.pushGeoData("18T XR 09894 36022");
		TraxUtil.pushGeoData("18T XR 09798 35989");
		TraxUtil.pushGeoData("18T XR 09710 35933");
		TraxUtil.pushGeoData("18T XR 09619 35887");
		TraxUtil.pushGeoData("18T XR 09784 36034");
		TraxUtil.pushGeoData("18T XR 09635 35879");
		TraxUtil.pushGeoData("18T XR 09728 35926");
		TraxUtil.pushGeoData("18T XR 09810 35984");
		TraxUtil.pushGeoData("18T XR 09910 36012");
		TraxUtil.pushGeoData("18T XR 09921 35911");
		TraxUtil.pushGeoData("18T XR 09831 35867");
		TraxUtil.pushGeoData("18T XR 09732 35846");
		TraxUtil.pushGeoData("18T XR 09700 35749");
		TraxUtil.pushGeoData("18T XR 09639 35622");
		TraxUtil.pushGeoData("18T XR 09718 35725");
		TraxUtil.pushGeoData("18T XR 09783 35533");
		TraxUtil.pushGeoData("18T XR 09757 35675");
		TraxUtil.pushGeoData("18T XR 09752 35568");
		TraxUtil.pushGeoData("18T XR 09794 35663");		
	}
};

module.exports = SampleData;
