"use strict";
/** Validation functions **/
Framework.Util.Val = class {

	constructor(obj, fieldname) {
		if (obj == undefined) obj = null;
		this._object = obj;
		this._fieldname = fieldname;
	}

	item (fieldname) {
		return new Framework.Util.Val(this._object, fieldname);
	}

	val (def) {
		var result = this._object;
		if (result != null && this._fieldname != null)
			result = result[this._fieldname]
		if (def != null)
			result = this._def(result, def);
		return result;
	}

	in () {
		if (!this._run()) // only validate in dev mode
			return this;
		var val = this.val();
		if (val == null) return this;
		for (var i=0; i<arguments.length; i++) {
			if (arguments[i] == val) return this;
		}
		throw new Error(this.val() + ' is not part of predefined list');
	}

	between(a, b) {
		if (!this._run()) // only validate in dev mode
			return this;
		var val = this.val();
		if (a != null && val != null && val < a)
			throw new Error('Field is less than expected');
		if (b != null && val != null && val > b)
			throw new Error('Field is larger than expected');
		return this;
	}

	is (type) {
		if (!this._run()) // only validate in dev mode
			return this;
		if (this._fieldname != null) {
			if (this._is(this.val(), type))
				return this;
			throw new Error(this._fieldname+' is '+typeof(this.val())+' expected '+type);
		}
		else {
			if (this._is(this._object, type))
				return this;
			throw new Error(this._object+' is '+typeof(this._object)+' expected '+type);
		}
	}

	req () {
		if (!this._run()) // only validate in dev mode
			return this;
		if (this._fieldname != null) {
			if (this._object != null && this.val() != null) return this;
			throw new Error(this._fieldname+' is required');
		} else {
			if (this._object != null) return this;
			throw new Error('Field is required');
		}
	}

	regex (expr) {
		if (!this._run()) // only validate in dev mode
			return this;
		expr = new RegExp(expr);
		if (this._fieldname != null) {
			if (expr.test(this.val())) return this;
			throw new Error(this._fieldname+' '+this.val()+' failed regex '+expr);
		} else {
			if (expr.test(this._object)) return this;
			throw new Error('Field failed regex '+expr);
		}
	}

	_run() {
		return Framework.mode == 'debug';
	}


	_is (obj, type) {
		if (obj == null) return true;
		var matched = false;
		switch (type.name) {
			case 'String' :
				matched = typeof obj === 'string';
				break;
			case 'Number' :
				matched = typeof obj === 'number';
				break;
			case 'Boolean':
				matched = typeof obj === 'boolean';
				break;
			default: 
				matched = obj instanceof type;
		}
		return matched;
	}

	_def (obj, val) {
		return obj == null ? val : obj;
	}

}

describe('Framework.Util.Val', function() {
	it('#all', function() {
		var fn = function() { };
		var obj = { item: 1, alpha: 0.5, hi: 'welcome', click: fn };
		var val = new Framework.Util.Val(obj);
		assert.equal(val.item('hi').is(String).val('bye'), 'welcome');
		assert.equal(val.item('item').is(Number).req().val(2), 1);
		assert.equal(val.item('item2').is(Number).val(2), 2);
		assert.throws(function() { val.item('item2').is(Number).req() }, Error);
		assert.equal(val.item('click').is(Function).val(null), fn);
		assert.throws(function() { val.item('item').is(String).def(2); }, Error);
		var val = new Framework.Util.Val(null);
		assert.throws(function() { val.item('item2').is(Number).req() }, Error);
		var val = new Framework.Util.Val('hi');
		assert.equal(val.is(String).val(null), 'hi');
		val.in('hi','bye');
		assert.throws(function() { val.in('hoya','blue'); }, Error);
		var x = new Framework.Util.Val(5);
		x.between(1, 5);
		x.between(5, 6);
		x.between(3, null);
		x.between(null, 7);
		assert.throws(function() { x.between(1, 4); }, Error);
		assert.throws(function() { x.between(6, null); }, Error);
		var y = new Framework.Util.Val(null);
		y.between(5, 1);
	});

	it('#regex', function() {
		var val = new Framework.Util.Val({
			percent: '50%',
			absolute: 100
		});
		val.item('percent').regex('^\\d*\\%?$');
		val.item('absolute').regex('^\\d*\\%?$')
	});
});