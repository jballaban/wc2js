"use strict";
/**
@namespace
**/
Framework.Util.DOM = {
	addVideo: function(src, x, y, width, height, autoplay, loop, oncomplete) {
	    var video = document.createElement('video');
	    var source = document.createElement('source');
	    video.appendChild(source);
	    source.setAttribute('src', src);
	    source.setAttribute('type', 'video/mp4');
		video.setAttribute('style', 'left:'+x+';top:'+y+';');
		this.setAttribute(video, 'width', width);
		this.setAttribute(video, 'height', height);
		this.setAttribute(video, 'autoplay', autoplay ? 'true' : null);
		this.setAttribute(video, 'loop', loop ? 'true' : null);
		if (oncomplete != null)
			video.onended = function() { oncomplete(); }.bind(this);
		document.body.appendChild(video);
		return video;
	},

	addDiv: function(classname) {
		var div = document.createElement('div')
		this.setAttribute(div, 'class', classname);
		document.body.appendChild(div);
		return div;
	},

	removeElement: function(el) {
		el.parentNode.removeChild(el);
	},

	setAttribute: function(el, attribute, value) {
		if (value == null)
			el.removeAttribute(attribute);
		else
			el.setAttribute(attribute, value);
	}
}

describe('Framework.Util.DOM', function() {
	it('#*', function() {
		
	});
});