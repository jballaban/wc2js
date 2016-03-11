"use strict";
/**
Defines a screen element
@requires Sprite/Sprite.js
@requires Mouse.js
@requires Framework/UI/UI.js
**/
Framework.UI.Element = class extends Framework.UI.iDrawable {
	/**
	@param {object} canvas - The canvas to draw too
	@param {Object} [options] - Override default values
	@param {boolean} [options.alpha=1] - Alpha setting: 0 = transparent, 1 = opaque
	@param {Framework.Element[]} [options.elements] - list of sub-elements if any
	@param {boolean} [options.active=true] - True if it should respond to update calls
	@param {boolean} [options.show=true] - True if is drawable
	@param {number} [options.x=0] - Object left coordinate (see position for relativeness)
	@param {number} [options.y=0] - Object top coordinate (see position for relativeness)
	@param {string} [options.width=0] - Object width (can be fixed or percentage of parent)
	@param {string} [options.height=0] - Object height (can be fixed or percentage of parent)
	@param {string} [options.hAlign=absolute] - X coord relativeness to parent: absolute, centered or relative
	@param {string} [options.vAlign=absolute] - Y coord relativeness to parent: absolute, centered or relative
	@param {?Object} options.sprite - Sprite to attach to this element if any
	@param {?Framework.Mouse.Mouse} [options.mouse] - Mouse to attach to this element if any
	**/
	constructor (canvas, options) {
		var _options = new Framework.Util.Val(options);
		super(canvas, _options.item('alpha').val(1));
		this.active = _options.item('active').is(Boolean).val(true);
		this.show = _options.item('show').is(Boolean).val(true);
		this._vAlign = _options.item('vAlign').is(String).in('absolute','relative','centered').val('relative');
		this._hAlign = _options.item('hAlign').is(String).in('absolute','relative','centered').val('relative');
		this._width = 0;
		this._height = 0;
		this._originalWidth = _options.item('width').val('0');
		this._originalHeight = _options.item('height').val('0');
		this._elements = [];
		var elements = _options.item('elements').is(Array).val([]);
		for (var i=0; i<elements.length; i++)
			this.addElement(elements[i]);
		this.x = _options.item('x').val(0);
		this.y = _options.item('y').val(0);
		this.sprite = _options.item('sprite').is(Framework.UI.iDrawable).val();
		this.mouse = _options.item('mouse').val();
		this._animations = [];
		this._listeners = {
			'hover': []
		};
		this._hovered = false;
		this.calculateLengths();
	}

	addListener(ev, fn) {
		this._listeners[ev].push(fn);
	}

	fireEvent(ev, data) {
		for (var i=0; i<this._listeners[ev].length; i++)
			this._listeners[ev][i](this, data);
	}

	addAnimation(animation, callback) {
		callback = new Framework.Util.Val(callback).is(Function).val(null);
		new Framework.Util.Val(animation).is(Framework.Util.Animate).req();
		if (callback != null)
			animation.callback = callback;
		// remove any animations that are based on the same attribute
		for (var i=0;i<this._animations.length; i++) {
			if (animation.conflict(this._animations[i]))
				this._animations.splice(i--,1);
		}
		this._animations.push(animation);
	}

	/**
	Attaches a new child to this element
	@param {Framework.Element} element - The child element to attach
	**/
	addElement(element) {
		new Framework.Util.Val(element).is(Framework.UI.Element).req();
		this._elements.push(element);
		element._parent = this; // double link
		element._dirtyX = element._dirtyY = element._dirtyMouse = true;
		element.calculateLengths();
	}

	/** 
	Element calculated absolute x position 
	@type {number}
	**/
	get x() {
		if (this._dirtyX) { this.x = this._offsetX; }
		return this._x;
	}
	set x(offset) {
		new Framework.Util.Val(offset).is(Number).req();
		this._dirtyX = false;
		this._offsetX = offset;
		var x = this._calcPoint('x');
		if (x == this._x) return;
		this._x = x;
		for (let i=0; i<this._elements.length; i++) // dirty children
			this._elements[i]._dirtyX = true;
	}

	/** 
	Element calculated absolute y position 
	@type {number}
	**/
	get y() {
		if (this._dirtyY) { this.y = this._offsetY; }
		return this._y;
	}
	set y(offset) {
		new Framework.Util.Val(offset).is(Number).req();
		this._dirtyY = false;
		this._offsetY = offset;
		var y = this._calcPoint('y');
		if (this._y == y) return;
		this._y = y;
		for (let i=0; i < this._elements.length; i++) // dirty children
			this._elements[i]._dirtyY = true;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	/** 
	Element calculed mouse (if null uses parent)
	@type {?Framework.Mouse}
	**/
	get mouse() {
		if (this._dirtyMouse) { this.mouse = this._originalMouse; }
		return this._mouse;
	}
	set mouse(mouse) {
		new Framework.Util.Val(mouse).is(Framework.IO.Mouse);
		this._dirtyMouse = false;
		this._originalMouse = mouse;
		if (mouse != null)
			this._mouse = mouse;
		else if (this._parent != null)
			this._mouse = this._parent.mouse;
		else
			this._mouse = null;
	}

	/**
	If active=true it will update the current background sprite and each child element
	**/
	update() {
		if (this.active) {
			for (let i=0; i<this._animations.length; i++) {
				this._animations[i].update();
				if (this._animations[i].completed) {
					var callback = this._animations[i].callback;
					this._animations.splice(i--, 1);
					if (callback != null)
						callback();
				}
			}
			if (this.sprite != null)
				this.sprite.update();
			for (let i=0; i<this._elements.length; i++) {
				this._elements[i].update();
			}
		}
	}

	/**
	If show=true, draws the current element to the screen (and all children)
	@param {boolean} a - The alpha to draw with
	**/
	draw(a) {
		if (this.show) {
			if (this.sprite != null)
				this.sprite.draw(this.x, this.y, this.width, this.height, this._alpha*a);
			for (var i=0; i<this._elements.length; i++) {
				this._elements[i].draw(this._alpha*a);
			}
		}
	}

	/**
	Determines if the existing object overlaps with the given x, y point
	@param {number} x - The x position
	@param {number} y - The y position
	@returns {boolean} - True if overlaps with self
	**/
	intersects(x, y) {
		new Framework.Util.Val(x).is(Number).req();
		new Framework.Util.Val(y).is(Number).req();
		return Framework.Util.Math.intersects(x, y, this.x, this.y, this.width, this.height);
	}

	/**
	Searches for an element at given position.  Will find the "lowest" element possible. 
	@returns {?Framework.Element} - Found element, null if no element found.
	**/
	elementAt(x, y) { // return top element at coords or null if none
		new Framework.Util.Val(x).is(Number).req();
		new Framework.Util.Val(y).is(Number).req();
		if (!this.active || !this.intersects(x, y))
			return null;
		for (var i=this._elements.length-1; i>=0; i--) {
			var el = this._elements[i].elementAt(x, y);
			if (el != null) return el;
		}
		return this;
	}

	/**
	Hovered state
	@returns {boolean}
	**/
	get hovered() {
		return this._hovered;
	}
	set hovered(val) {
		new Framework.Util.Val(val).is(Boolean).req();
		if (val == this._hovered) return;
		this._hovered = val;
		this.fireEvent('hover', val);
	}

	get sprite() {
		return this._sprite;
	}

	set sprite(sprite) {
		this._sprite = sprite;
	}

	/**
	Triggered when the mouse blurs from this element.  See {@link Framework.Mouse.MouseHandler#update}
	**/
	mouseOut() { // triggered when mouse leaves this element
		this.hovered = false;
		if (this._parent != null)
			this._parent.mouseOut();
	}
	
	/**
	Triggered when the mouse focuses on this element.  See {@link Framework.Mouse.MouseHandler#update}
	**/
	mouseOver() { // when mouse is hovering over this element
		this.hovered = true;
		if (this._parent != null)
			this._parent.mouseOver();
	}
	
	/**
	@deprecated Not implemented
	**/
	mouseClick() {} // when mouseup releases on this element

	calculateLengths() {
		this._setWidth(this._originalWidth);
		this._setHeight(this._originalHeight);
	}

	resize() {
		this.calculateLengths();
		this._dirtyX = this._dirtyY = true;
		for (var i=0; i<this._elements.length; i++)
			this._elements[i].resize();
	}

	/************************************************************************************/

	_calcPoint(aspect) {
		var axis = aspect=='x' ? '_hAlign' : '_vAlign';
		var offset = aspect=='x' ? '_offsetX' : '_offsetY';
		var dimension = aspect=='x' ? 'width' : 'height';
		switch (this[axis]) {
			case 'absolute' :
				return this[offset]; // offset is real world point
			case 'centered' : // center on parent's calculated position: relative + half parent width - half our width
				if (this._parent == null)
					return this[offset] - (this[dimension] / 2);
				return this._parent[aspect] + this[offset] + (this._parent[dimension] / 2) - (this[dimension] / 2);
			case 'relative' : // offset relative to parent
				if (this._parent == null)
					return this[offset];
				return this._parent[aspect] + this[offset];
			default:
				throw 'Unknown relativity '+this[axis];
		}
	}

	_getRelativePoint(dimension) {
		var axis = dimension == 'width' ? '_hAlign' : '_vAlign';
		var offset = dimension == 'width' ? '_offsetX' : '_offsetY';
		if (this[axis] == 'relative')
			return this[offset]
		return 0;
	}

	_isParentWidthDynamic() {
		return this._parent != null && this._parent._originalWidth.toString().startsWith('%');
	}

	_isParentHeightDynamic() {
		return this._parent != null && this._parent._originalHeight.toString().startsWith('%');
	}

	_largestChild(dimension) {
		var val = 0;
		for (var i=0; i<this._elements.length; i++) {
			val = Math.max(val, this._elements[i][dimension] + this._elements[i]._getRelativePoint(dimension));
		}
		return val;
	}

	_calcLength(val, dimension) {
		var pad = 0;
		if (val.toString().indexOf('+') > -1) {
			pad = parseInt(val.split('+')[1]);
			val = val.split('+')[0];
		}
		if (val.toString().indexOf('%') > -1) {
			if (val.indexOf('%') == 0) {
				val = this._largestChild(dimension);
			} else if (this._parent == null) {
				val = 0;
			} else {
				var percent = parseInt(val.substring(0, val.indexOf('%'))) / 100;
				val = parseInt(percent * this._parent[dimension]);
			}
		}
		return parseInt(val) + pad;
	}

	_setWidth(val) {
		this._width = this._calcLength(val, 'width');
		if (this._isParentWidthDynamic())
			this._parent.calculateLengths();
	}

	_setHeight(val) {
		this._height = this._calcLength(val, 'height');
		if (this._isParentHeightDynamic())
			this._parent.calculateLengths();
	}
}

describe('Framework.UI.Element', function() {

	it('#tructor', function() {
		var el = new Framework.UI.Element(runtime);
		var el2 = new Framework.UI.Element(runtime, {
			alpha: 0.5,
			active: false,
			parent: null,
			show: false,
			x: 10,
			y: 10,
			width: 5,
			height: 5,
			vAlign: 'centered',
			hAlign: 'absolute', 
			sprite: new Framework.UI.Rectangle(runtime)
		});
		var el3 = new Framework.UI.Element(runtime, {
			elements: [ el ]
		});
	});

	it ('#addElement', function() {
		var el = new Framework.UI.Element(runtime);
		var el2 = new Framework.UI.Element(runtime);
		el2.addElement(el);
		assert.equal(el._parent, el2);
		assert.notEqual(el2._elements.indexOf(el), -1);
	});

	it ('#_calcLength', function() {
		var top = new Framework.UI.Element(runtime.canvas, { width: '200' }); 
		var el = new Framework.UI.Element(runtime.canvas, { width: '%' });
		var el1 = new Framework.UI.Element(runtime.canvas, { width: 20 });
		var el2 = new Framework.UI.Element(runtime.canvas, { width: '25%' });
		var el3 = new Framework.UI.Element(runtime.canvas, { width: '25%+5' });
		top.addElement(el);
		el.addElement(el1);
		el1.addElement(el2);
		el1.addElement(el3);
		assert.equal(el.width, 20);
		assert.equal(el1.width, 20);
		assert.equal(el2.width, 5);
		assert.equal(el3.width, 10);
	});

	it ('#x,y,width,height,calcPoint,mouse', function() {
		var mouse = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
		var mouse2 = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
		var mouse3 = new Framework.IO.Mouse(Framework.UI.Cursor.Pointer);
		var el = new Framework.UI.Element(runtime.canvas, {
			x: 10,
			y: 10,
			width: 50,
			height: 20,
			mouse: mouse
		});
		var el2 = new Framework.UI.Element(runtime.canvas, {
			x: 1,
			y: 1,
			width: 20,
			height: '50%',
			hAlign: 'relative',
			vAlign: 'absolute'
		});
		var el3 = new Framework.UI.Element(runtime.canvas, {
			mouse: mouse3
		});
		var el4 = new Framework.UI.Element(runtime.canvas, {
			width: '%+5'
		});
		el4.addElement(el);
		assert.equal(el4.width, 65);
		el.addElement(el2);
		el2.addElement(el3);
		assert.equal(el2.x, 11);
		assert.equal(el2.y, 1);
		assert.equal(el2.width, 20);
		assert.equal(el2.height, 10);
		assert.equal(el2.mouse, mouse);
		el2.mouse = mouse2;
		assert.equal(el2.mouse, mouse2);
		assert.equal(el3.mouse, mouse3);
	});

	it ('#update,draw', function() {
		var el = new Framework.UI.Element(runtime.canvas);
		el.update();
		el.draw(0.5);
	});

	it ('#intersects,elementAt', function() {
		var el = new Framework.UI.Element(runtime.canvas, { x: 5, y: 5, width: 10, height: 10 });
		var el2 = new Framework.UI.Element(runtime.canvas, { x: 5, y: 5, width: 1, height: 1, vAlign: 'absolute', hAlign: 'absolute' });
		el.addElement(el2);
		assert.equal(el.intersects(5,4), false);
		assert.equal(el.intersects(5,8), true);
		assert.equal(el2.intersects(5,5), true);
		assert.equal(el.elementAt(5,5), el2);
		assert.equal(el.elementAt(5,6), el);
	});

	it ('#mouseOut,mouseOver,mouseClick,hovered', function() {
		var el = new Framework.UI.Element(runtime.canvas, { x: 5, y: 5, width: 10, height: 10 });
		el.mouseOut();
		assert.equal(el.hovered, false);
		el.mouseOver();
		assert.equal(el.hovered, true);
		el.mouseClick();
	});
});