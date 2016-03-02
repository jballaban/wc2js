"use strict";
/**
@namespace
**/
Framework.Util.Timer = class {
	constructor(duration) {
		this._start = performance.now();
		this._duration = new Framework.Util.Val(duration).is(Number).val(null);
	}

	elapsed() {
		return performance.now() - this._start;
	}

	lap() {
		this._start = performance.now();
	}

	lapped() {
		if (this._duration == null)
			throw new Error('Passed cannot be used without a duration');
		return (this.elapsed() >= this._duration);
	}

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