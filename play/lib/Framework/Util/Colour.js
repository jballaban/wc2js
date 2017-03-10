"use strict";
/**
Colour manipulation tools
@namespace
**/
Framework.Util.Colour = {
	/**
	Takes a colour code and returns a map (R: , G:, B:) of numeric values
	@param {string} colour - The hex to process (must be 6 digits)
	@returns {object} - A map representing the string
	**/
	split: function(colour) {
		return {
			'R': parseInt(colour.slice(1,3), 16),
			'G': parseInt(colour.slice(3,5), 16),
			'B': parseInt(colour.slice(5,7), 16) 
		};
	},

	/**
	Returns a vector map describing the increments necessary on each map field to get from start to end within x ticks
	@param {string} start - Start colour HEX
	@param {string} end - End colour HEX
	@param {number} steps - The number of ticks
	@returns {object} - A vector map
	**/
	getVectorMap: function(start, end, steps) {
		var startMap = this.split(start);
		var endMap = this.split(end);
		var diff = this._diff(startMap, endMap);
		return {
			'R': diff.R/steps,
			'G': diff.G/steps,
			'B': diff.B/steps
		};
	},

	/**
	Applies a vector to a colour state
	@param {object} colourMap - The colour map to move
	@param {object} vectorMap - The vector to apply
	@returns {object} - colourMap updated
	**/
	applyVector: function(colourMap, vectorMap) {
		colourMap.R += vectorMap.R;
		colourMap.G += vectorMap.G;
		colourMap.B += vectorMap.B;
		return colourMap;
	},

	/**
	Converts colour map back to HEX string
	@param {object} colourMap - The colour map to convert
	@returns {string} - HEX colour
	**/
	toString: function(colourMap) {
		return '#' + ('0'+Math.round(colourMap.R).toString(16)).slice(-2) + '' + ('0'+Math.round(colourMap.G).toString(16)).slice(-2) + '' + ('0'+Math.round(colourMap.B).toString(16)).slice(-2); 
	},

	_diff: function(colourMapA, colourMapB) {
		return {
			'R': colourMapB.R - colourMapA.R,
			'G': colourMapB.G - colourMapA.G,
			'B': colourMapB.B - colourMapA.B
		};
	},
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