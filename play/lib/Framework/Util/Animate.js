"use strict";
/**
Generic animation handler
**/
Framework.Util.Animate = class {
	/**
	@param {object} object - The object to update
	@param {string} field - The object's attribute to target
	@param {object} endvalue - The final value of the animation
	@param {number} ticks - The number of update ticks (not time!) to complete
	**/
	constructor(object, field, endvalue, ticks) {
		this._object = object;
		this._field = field;
		this._ticks = ticks;
		this._tick = 0;
		this._endvalue = endvalue;
		this._hex = endvalue.toString().startsWith('#');
		this._inc = this._getInc(object[field], endvalue, ticks);
		this._current = this._hex ? Framework.Util.Colour.split(object[field]) : object[field];
	}

	/**
	Tests if this animation conflicts with the provided (updates same field or not)
	@param {Framework.Util.Animate} animate - The comparable animation
	**/
	conflict(animate) {
		return animate._object == this._object && animate._field == this._field;
	}

	/**
	True once number of ticks has passed
	@type {bool}
	**/
	get completed() {
		return this._tick == this._ticks;
	}

	/**
	Pushes the animation forward a single tick
	**/
	update() {
		if (this.completed) return;
		this._tick++;
		if (this.completed)
			this._object[this._field] = this._endvalue;
		else
			this._step();
	}

	_step() {
		if (this._hex) {
			this._current = Framework.Util.Colour.applyVector(this._current, this._inc);
			this._object[this._field] = Framework.Util.Colour.toString(this._current);
		} else {
			this._object[this._field] += this._inc;
		}
	}

	_getInc(start, end, ticks) {
		if (this._hex)
			return Framework.Util.Colour.getVectorMap(start, end, ticks);
		return (end - start) / ticks;
	}
}

describe('Framework.Util.Animate', function() {
	it('#*', function() {
		var obj = { e: 0, c: '#230A34' };
		var animate = new Framework.Util.Animate(obj, 'e', 1, 2);
		animate.update();
		assert.equal(obj.e, 0.5);
		animate.update();
		animate.update();
		assert.equal(obj.e, 1);
		var animate2 = new Framework.Util.Animate(obj, 'c', '#123242', 2);
		animate2.update();
		animate2.update();
		assert.equal(obj.c, '#123242');
	});
});