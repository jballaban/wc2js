"use strict";
/**
Timing utilities
@namespace
**/
Framework.Util.Timer = class {
	/**
	@param {number} ?duration - The number of seconds until completion.  Null if don't care.
	**/
	constructor(duration) {
		this._start = performance.now();
		this._duration = new Framework.Util.Val(duration).is(Number).val(null);
	}

	/**
	How many milliseconds have elapsed since constructor called
	@returns {number}
	**/
	elapsed() {
		return performance.now() - this._start;
	}

	/**
	Resets timer
	**/
	lap() {
		this._start = performance.now();
	}

	/**
	True if milliseconds have passed duration expectation
	@returns {boolean}
	**/
	lapped() {
		if (this._duration == null)
			throw new Error('Passed cannot be used without a duration');
		return (this.elapsed() >= this._duration);
	}

	/**
	Returns the number of milliseconds elapsed past duration (0 if not passed yet)
	@returns {number}
	**/
	over() {
		if (this._duration == null)
			throw new Error('Cannot use this without a duration');
		return Math.abs(Math.max(0, this.elapsed() - this._duration));
	}
}

describe('Framework.Util.Timer', function() {
	it('#*', function(done) {
		var timer = new Framework.Util.Timer(10);
		assert.equal(timer.lapped(), false);
		setTimeout(function() {
			assert.equal(timer.elapsed() > 0, true);
			assert.equal(timer.lapped(), true);
			done();
		}, 10);
	});
});