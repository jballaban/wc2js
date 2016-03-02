"use strict";
/**
@namespace
**/
Framework.Util.Animate = class {
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

	conflict(animate) {
		return animate._object == this._object && animate._field == this._field;
	}

	get _completed() {
		return this._tick == this._ticks;
	}

	update() {
		if (this._completed) return;
		this._tick++;
		if (this._completed)
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