"use strict";
/**
@namespace
**/
Framework.Util.Colour = {
	split: function(colour) {
		return {
			'R': parseInt(colour.slice(1,3), 16),
			'G': parseInt(colour.slice(3,5), 16),
			'B': parseInt(colour.slice(5,7), 16) 
		};
	},
	getVectorMap: function(start, end, steps) {
		var startMap = this.split(start);
		var endMap = this.split(end);
		var diff = this.diff(startMap, endMap);
		return {
			'R': diff.R/steps,
			'G': diff.G/steps,
			'B': diff.B/steps
		};
	},
	diff: function(colourMapA, colourMapB) {
		return {
			'R': colourMapB.R - colourMapA.R,
			'G': colourMapB.G - colourMapA.G,
			'B': colourMapB.B - colourMapA.B
		};
	},
	applyVector: function(colourMap, vectorMap) {
		colourMap.R += vectorMap.R;
		colourMap.G += vectorMap.G;
		colourMap.B += vectorMap.B;
		return colourMap;
	},
	toString: function(colourMap) {
		return '#' + ('0'+Math.round(colourMap.R).toString(16)).slice(-2) + '' + ('0'+Math.round(colourMap.G).toString(16)).slice(-2) + '' + ('0'+Math.round(colourMap.B).toString(16)).slice(-2); 
	}
}

describe('Framework.Util.Colour', function() {
	it('#*', function() {
		var start = '#FF0000';
		var end = '#333434';
		var map = Framework.Util.Colour.split(start);
		assert.equal(Framework.Util.Colour.toString(map).toUpperCase(), start);
		var vector = Framework.Util.Colour.getVectorMap(start, end, 2);
		map = Framework.Util.Colour.applyVector(map, vector);
		assert.notEqual(Framework.Util.Colour.toString(map), start);
		assert.notEqual(Framework.Util.Colour.toString(map), end);
		map = Framework.Util.Colour.applyVector(map, vector);
		assert.equal(Framework.Util.Colour.toString(map), end);
	});
});