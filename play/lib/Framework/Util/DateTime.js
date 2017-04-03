"use strict";
/**
Date & Time utilities
@namespace
**/
Framework.Util.DateTime = class {
	constructor(date) {
		this._now = new Framework.Util.Val(date).is(Date).val(new Date());
	}

	toString() {
		return [ this._now.getFullYear(), this._now.getMonth()+1, this._now.getDate() ].join('-')+' '+[ this._now.getHours(), this._now.getMinutes(), this._now.getSeconds() ].join(':');
	}

}

describe('Framework.Util.DateTime', function() {
	it('#toString', function() {
		var datetime = new Framework.Util.DateTime(new Date(2011, 1, 1, 1, 1, 1)); // month 1 actuall means february!
		assert.equal(datetime.toString(), '2011-2-1 1:1:1');
	});
});