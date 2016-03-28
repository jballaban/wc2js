/**
Math library
@namespace
**/
Framework.Util.Math = {
	/**
	Calculates if pointx,y intersect with x-width, y-height square
	@returns {boolean} true if intersects
	**/
	intersects : function(pointx, pointy, x, y, width, height) {
		return (pointx >= x && pointx < x+width && pointy >=y && pointy < y+height);
	},

	random: function(min, max) {
		var val = Math.random() * (max - min) + min;
		if (min % 1 == 0 && max % 1 == 0) { // we want decimal
			return Math.round(val);
		}
		return val;
	}
}

describe('Framework.Util.Math', function() {
	it('#intersects', function() {
		assert.equal(Framework.Util.Math.intersects(10,14,5,5,10,10), true);
		assert.equal(Framework.Util.Math.intersects(10,4,5,5,10,10), false);
		assert.equal(Framework.Util.Math.intersects(5,6,5,5,1,1), false);
	});

	it ('#random', function() {
		var rnd = Framework.Util.Math.random(-0.1, -0.1);
		assert.equal(rnd, -0.1);
	})
});