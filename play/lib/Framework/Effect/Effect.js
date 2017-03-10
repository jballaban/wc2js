"use strict";
/**
Generic animation effects
@namespace
**/
Framework.Effect = {
	/**
	Applies a linear fade of an items attribute within a given time
	@param {Framework.UI.iDrawable} owner - The element that owns the animation
	@param {Framework.UI.iDrawable} item - The element that will be targetted
	@param {string} field - The items' attribute to update
	@param {number} duration - The number of milliseconds to complete operation
	@param {function} callback - Callback to trigger once duration is complete
	**/
	fade: function(owner, item, field, to, duration, callback) {
		owner.addAnimation(new Framework.Util.Animate(item, field, to, runtime.getTicks(duration)), callback);
	}
}