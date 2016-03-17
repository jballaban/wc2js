"use strict";
Framework.Effect = {
	fade: function(owner, item, field, to, duration, callback) {
		owner.addAnimation(new Framework.Util.Animate(item, field, to, runtime.getTicks(duration)), callback);
	}
}