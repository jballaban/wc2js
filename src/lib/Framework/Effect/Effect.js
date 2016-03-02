"use strict";
Framework.Effect = {
	fade: function(owner, item, field, to, duration) {
		owner.addAnimation(new Framework.Util.Animate(item, field, to, runtime.getTicks(duration)));
	}
}